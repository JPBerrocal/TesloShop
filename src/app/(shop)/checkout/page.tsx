import Link from "next/link";
import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";

export default function CheckoutPage() {
  const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
  ];

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verificar orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Verificar pedido</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {/* Items in cart */}
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  alt={product.title}
                  width={100}
                  height={100}
                  style={{
                    height: "100px",
                    width: "100px",
                  }}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className="rounded-xl shadow-xl p-7 h-fit bg-white">
            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Juan Berrocal</p>
              <p>Av. Siempre Viva 123</p>
              <p>12345, CABA</p>
              <p>Argentina</p>
            </div>
            <div className="w-full h-0.5 rounded bg-gray-200 mb-5" />

            <h2 className="text-2xl  font-bold mb-2">Resumen de compra</h2>
            <div className="grid grid-cols-2">
              <span>No. de productos</span>
              <span className="text-right">3 articulos</span>
              <span>Subtotal</span>
              <span className="text-right">$300</span>
              <span>Impuestos (10%)</span>
              <span className="text-right">$30</span>
              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">$330</span>
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

              <Link
                href="/orders/123"
                className="flex btn-primary justify-center"
              >
                Colocar orden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
