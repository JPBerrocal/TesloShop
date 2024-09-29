"use client";

import React, { useState } from "react";
import { QuantitySelector, SizeSelector } from "@/components";
import type {
  CartProduct,
  Product,
  Size,
} from "@/interfaces/product.interface";
import { useCartStore } from "@/store";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const handleAddToCart = () => {
    setPosted(true);
    if (!size) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      size,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setPosted(false);
    setSize(undefined);
    setQuantity(1);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una talla*
        </span>
      )}
      {/*Selector de tallas*/}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeSelected={setSize}
      />
      {/*Selector de cantidad*/}
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
      <button className="btn-primary my-5" onClick={handleAddToCart}>
        Agregar al carrito
      </button>
    </>
  );
};
