"use client";

import { useCartStore } from "@/store";
import React, { useEffect, useState } from "react";
import { currencFormat } from "../../../../utils/currencyFormatter";

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const { totalItems, subTotal, taxes, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2">
        <span>No. de productos</span>
        <span className="text-right">{totalItems} articulos</span>
        <span>Subtotal</span>
        <span className="text-right">{currencFormat(subTotal)}</span>
        <span>Impuestos (15%)</span>
        <span className="text-right">{currencFormat(taxes)}</span>
        <span className="mt-5 text-2xl">Total</span>
        <span className="mt-5 text-2xl text-right">{currencFormat(total)}</span>
      </div>
    </>
  );
};
