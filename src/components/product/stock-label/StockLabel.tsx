"use client";

import { useEffect, useState } from "react";
import { getStockBySlug } from "@/actions/products/get-stock-by-slug";
import { titleFont } from "@/config/fonts";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStock = async () => {
      const stock = await getStockBySlug(slug);
      setStock(stock);
      setIsLoading(false);
    };

    loadStock();
  }, [slug]);

  return (
    <>
      {isLoading ? (
        <h1
          className={`${titleFont.className} antialiased font-bold text-lg bg-gray-300 animate-pulse`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
