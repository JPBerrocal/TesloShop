"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { PayPalOrderStatusResponse } from "@/interfaces";
import { cache } from "react";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
  const authToken = await getPaypalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener el token de acceso de PayPal",
    };
  }

  const response = await verifyPaypalPayment(transactionId, authToken);

  if (!response) {
    return {
      ok: false,
      message: "No se pudo verificar el pago con PayPal",
    };
  }

  const { status, purchase_units } = response;
  const { invoice_id: orderId } = purchase_units[0];
  //console.log("Status: ", status);
  //console.log("Purchase units: ", purchase_units);

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "El pago no fue completado",
    };
  }

  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);
    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al verificar el pago con PayPal",
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLILENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLILENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const url = process.env.PAYPAL_OAUTH_URL ?? "";

  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64Token}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  };

  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const verifyPaypalPayment = async (
  transactionId: string,
  paypalToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const baseUrl = process.env.PAYPAL_ORDERS_URL ?? "";

  const url = `${baseUrl}/${transactionId}`;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${paypalToken}`,
    },
  };

  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
