"use server";

import prisma from "@/lib/prisma";
import { sleep } from "@/utils/sleep";

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    //await sleep(2);

    const product = await prisma.product.findFirst({
      select: {
        inStock: true,
      },
      where: {
        slug: slug,
      },
    });

    return product?.inStock ?? 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
