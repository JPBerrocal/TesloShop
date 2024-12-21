"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const setTransactiondId = async (
  orderId: string,
  transactionId: string
) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: "No hay una sesión activa",
    };
  }

  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId: transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: "No se encontro una orden con el id asociado",
      };
    }

    return {
      ok: true,
      message: "Actualización realizada con éxito",
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo realizar la actualización",
    };
  }
};
