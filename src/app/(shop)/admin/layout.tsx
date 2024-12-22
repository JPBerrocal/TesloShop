import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

/**
 * Esto se debe hacer con un middleware, se implemento de esta ya que el middleware de auth.js no estaba funcionando.
 * Nota: 12/22/2024 Ya funcina el middleware, investigar como implementar.
 *
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
