"use server";

import prisma from "@/lib/prisma";

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error(error);
    return null;
  }
};
