"use server";

import { auth } from "@/auth.config";
import type { Size, Address } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsInCart: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario",
    };
  }

  //obtener info de los productos
  //Nota pueden existir varios productos con el mismo ID en el pedido

  const dbProducts = await prisma.product.findMany({
    where: {
      id: {
        in: productsInCart.map((p) => p.productId),
      },
    },
    select: {
      id: true,
      title: true,
      price: true,
      inStock: true,
    },
  });

  //console.log("\n");
  //console.log("Db products: ", dbProducts);

  //calcular montos
  const itemsInOrder = productsInCart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  //console.log("\n");
  //console.log("Items in order: ", itemsInOrder);

  const { subTotal, tax, total } = productsInCart.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = dbProducts.find((p) => p.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;
      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  //console.log("\n");
  //console.log("subTotal: ", subTotal, "tax: ", tax, "total: ", total);

  //crear la transacción de base de datos para el pedido
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      //1. Actualizar stock de productos
      const updatedProductsPromises = dbProducts.map((product) => {
        const productQuantity = productsInCart
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      //verificar valores negativos en stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.id} no tiene stock suficiente`);
        }
      });

      //2. Crear el pedido encabezado - detalles
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productsInCart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                price:
                  dbProducts.find((p) => p.id === item.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      //3. Crear la direccion de la orden
      const orderAddress = await tx.orderAddress.create({
        data: {
          orderId: order.id,
          address: address.address,
          address2: address.address2,
          city: address.city,
          firstName: address.firstName,
          lastName: address.lastName,
          postalCode: address.postalCode,
          phone: address.phone,
          countryId: address.country,
        },
      });

      return {
        order: order,
        updatedProducts: updatedProducts,
        address: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    console.log("Error en la transacción: ", error);
    return {
      ok: false,
      message: error?.message,
    };
  }
}; ///
