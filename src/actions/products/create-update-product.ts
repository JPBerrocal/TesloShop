"use server";

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

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

    const prismaTx = await prisma.$transaction(
      async (tx) => {
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

        //Carga y guardado de imagnes
        if (formData.getAll("images")) {
          const images = await uploadImages(
            formData.getAll("images") as File[]
          );
          console.log(images);
        }

        return {
          dbProduct,
        };
      },
      {
        timeout: 10000,
      }
    );

    //Revalidacion de paths
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${prismaTx.dbProduct.slug}`);
    revalidatePath(`/products/${prismaTx.dbProduct.slug}`);

    return {
      ok: true,
      updatedProduct: prismaTx.dbProduct,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al salvar el producto",
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");

      return cloudinary.uploader
        .upload(`data:image/png;base64,${base64Image}`, {
          folder: "teslo-shop",
        })
        .then((result) => result.secure_url);
    });

    const upladedImages = await Promise.all(uploadPromises);
    return upladedImages;

    //
  } catch (error) {
    console.log(error);
    return null;
  }
};
