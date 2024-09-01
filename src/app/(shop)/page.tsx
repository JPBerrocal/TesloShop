import { redirect } from "next/navigation";
import { getPaginatedProductsWithImages } from "@/actions";
import { ProductGrid } from "@/components";
import { Title } from "@/components/ui/title/Title";
import { initialData } from "@/seed/seed";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { products } = await getPaginatedProductsWithImages({ page });

  if (products.length === 0) {
    redirect("/");
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <ProductGrid products={products} />
    </>
  );
}
