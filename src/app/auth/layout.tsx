export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="bg-emerald-400 min-h-screen">{children}</main>;
}
