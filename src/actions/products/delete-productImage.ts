"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL || "");

export const deleteProductImage = async (imageId: string, imageUrl: string) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "No tienes permisos para realizar esta acción",
    };
  }

  if (!imageUrl.startsWith("http")) {
    return {
      ok: false,
      message:
        "De momento no es posible eliminar imagenes en el directorio local",
    };
  }

  try {
    const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";

    await cloudinary.uploader.destroy(`teslo-shop/${imageName}`);
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    //Revalidacion de paths
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${deletedImage.product?.slug}`);
    revalidatePath(`/products/${deletedImage.product?.slug}`);

    console.log("Nombre image", imageName);
  } catch (e) {
    console.log(e);
    return { ok: false, message: "Error al eliminar la imagen" };
  }
};
