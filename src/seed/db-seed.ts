import { initialData } from "./seed";
import prisma from "../lib/prisma";

async function main() {
  await Promise.all([
    await prisma.user.deleteMany(),
    await prisma.productImage.deleteMany(),
    await prisma.product.deleteMany(),
    await prisma.category.deleteMany(),
  ]);

  const { categories, products, users } = initialData;

  //users
  await prisma.user.createMany({
    data: users,
  });

  //categories
  const categoriesData = categories.map((name) => ({
    name,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  //relacion category-product
  const categoriesDB = await prisma.category.findMany();

  const categoryMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  //products
  products.forEach(async (product) => {
    const { images, type, ...cleanProduct } = product;
    const productDb = await prisma.product.create({
      data: {
        ...cleanProduct,
        categoryId: categoryMap[type],
      },
    });

    //images
    const imagesData = images.map((image) => ({
      productId: productDb.id,
      url: image,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log("Seed executed");
}

(() => {
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping seed");
    return;
  }
  main();
})();
