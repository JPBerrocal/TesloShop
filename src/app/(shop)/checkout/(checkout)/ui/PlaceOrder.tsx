"use client";

import { useAddressStore, useCartStore } from "@/store";
import { currencFormat } from "@/utils";
import { useEffect, useState } from "react";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const address = useAddressStore((state) => state.address);
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
    <div className="rounded-xl shadow-xl p-7 h-fit bg-white">
      <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>
      <div className="w-full h-0.5 rounded bg-gray-200 mb-5" />

      <h2 className="text-2xl  font-bold mb-2">Resumen de compra</h2>
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
      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            Al hacer clic en "Colocar orden", aceptas nuestros{" "}
            <a href="#" className="underline">
              Términos y Condiciones
            </a>{" "}
            y la{" "}
            <a href="#" className="underline">
              Política de privacidad
            </a>
          </span>
        </p>

        <button
          //href="/orders/123"
          className="flex btn-primary justify-center"
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
