import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: Props) {
  const { slug } = params;
  const product = initialData.products.find((product) => product.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      {/* SlideShow */}
      <div className="col-span-1 md:col-span-2 bg-sky-500">
        Product Slideshow
      </div>
      {/* Details */}
      <div className="col-span-1 px-5 bg-slate-400">Product details</div>
    </div>
  );
}
