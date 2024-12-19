"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrdersByUser = async () => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: "No hay una sesión activa",
    };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session?.user?.id,
      },
      select: {
        id: true,
        isPaid: true,
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return {
      ok: true,
      orders: orders,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al obtener los pedidos del usuario",
    };
  }
};
