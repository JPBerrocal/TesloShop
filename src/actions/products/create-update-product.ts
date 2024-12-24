"use server";

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { z } from "zod";

const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((value) => Number(value.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((value) => Number(value.toFixed(0))),
  tags: z.string(),
  sizes: z.coerce.string().transform((value) => value.split(",")),
  gender: z.nativeEnum(Gender),
  categoryId: z.string().uuid(),
});

export const upsertProduct = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData);
    const parsedProduct = ProductSchema.safeParse(data);

    if (!parsedProduct.success) {
      console.log(parsedProduct.error);
      return {
        ok: false,
        message: parsedProduct.error.message,
      };
    }

    const product = parsedProduct.data;

    product.slug = product.slug.toLowerCase().replace(/ /g, "_").trim();

    const { id, ...rest } = product;

    const prismaTx = await prisma.$transaction(async (tx) => {
      let dbProduct: Product;
      const tagsArray = rest.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      if (id) {
        dbProduct = await tx.product.update({
          where: {
            id,
          },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        dbProduct = await tx.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      }
      console.log("Product: ", dbProduct);
      return {
        dbProduct,
      };
    });

    //Revalidacion de paths
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al salvar el producto",
    };
  }
};
