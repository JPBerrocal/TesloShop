export interface Product {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  //TODO type: ProductType;
  gender: Category;
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
}

export interface ProductImage {
  id: string;
  url: string;
  productId?: string;
}

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ProductType = "shirts" | "pants" | "hoodies" | "hats";
export type Category = "men" | "women" | "kid" | "unisex";
