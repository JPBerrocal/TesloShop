export const revalidate = 604800; //1 week

import { getProductBySlug } from "@/actions";
import {
  MobileProductSlideShow,
  ProductSlideShow,
  QuantitySelector,
  SizeSelector,
  StockLabel,
} from "@/components";
import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3 ">
      {/* SlideShow */}
      <div className="col-span-1 md:col-span-2">
        {/* MOBILE SlideShow */}
        <MobileProductSlideShow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        {/* DESKTOP SlideShow */}
        <ProductSlideShow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>
      {/* Details */}
      <div className="col-span-1 px-5">
        <StockLabel slug={product.slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price}</p>
        {/*Selector de tallas*/}
        <SizeSelector
          selectedSize={product.sizes[0]}
          availableSizes={product.sizes}
        />
        {/*Selector de cantidad*/}
        <QuantitySelector quantity={4} />
        <button className="btn-primary my-5">Agregar al carrito</button>
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
