"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: "No hay una sesión activa",
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        ok: false,
        message: "No se encontró el pedido",
      };
    }

    if (session.user.role === "user") {
      if (order.userId !== session.user.id) {
        return {
          ok: false,
          message: "No tienes permiso para ver este pedido",
        };
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al obtener el pedido",
    };
  }
};
