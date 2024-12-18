"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencFormat } from "@/utils";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const address = useAddressStore((state) => state.address);
  const { totalItems, subTotal, taxes, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const response = await placeOrder(productsToOrder, address);

    if (!response.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(response.message);
      return;
    }

    //console.log("Place order response", response);

    clearCart();
    router.replace("/orders/" + response.order?.id);
  };

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

        {<p className="text-red-500">{errorMessage}</p>}
        <button
          //href="/orders/123"
          disabled={isPlacingOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
