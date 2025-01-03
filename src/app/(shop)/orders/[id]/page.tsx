import { OrderStatus, PayPalButton, Title } from "@/components";
import Image from "next/image";
import { getOrderById } from "@/actions";
import { redirect } from "next/navigation";
import { currencFormat } from "@/utils";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order!.isPaid} />

            {/* Items in cart */}
            {order!.OrderItem.map((item) => (
              <div
                key={item.product.slug + "-" + item.size}
                className="flex mb-5"
              >
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  alt={item.product.title}
                  width={100}
                  height={100}
                  style={{
                    height: "100px",
                    width: "100px",
                  }}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{item.product.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className="rounded-xl shadow-xl p-7 h-fit bg-white">
            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {order?.OrderAddress?.firstName} {order?.OrderAddress?.lastName}
              </p>
              <p>{order?.OrderAddress?.address}</p>
              <p>{order?.OrderAddress?.address2}</p>
              <p>{order?.OrderAddress?.postalCode}</p>
              <p>
                {order?.OrderAddress?.city}, {order?.OrderAddress?.countryId}
              </p>
              <p>{order?.OrderAddress?.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-5" />

            <h2 className="text-2xl  font-bold mb-2">Resumen de compra</h2>
            <div className="grid grid-cols-2">
              <span>No. de productos</span>
              <span className="text-right">
                {order?.itemsInOrder} articulos
              </span>
              <span>Subtotal</span>
              <span className="text-right">
                {currencFormat(order!.subTotal)}
              </span>
              <span>Impuestos (15%)</span>
              <span className="text-right">{currencFormat(order!.tax)}</span>
              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">
                {currencFormat(order!.total)}
              </span>
            </div>
            <div className="mt-5 mb-2 w-full">
              {order!.isPaid ? (
                <OrderStatus isPaid={order!.isPaid} />
              ) : (
                <PayPalButton orderId={order!.id} amount={order!.total} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
