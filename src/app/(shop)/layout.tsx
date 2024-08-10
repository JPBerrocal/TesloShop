import { Footer, SideMenu } from "@/components";

import { TopMenu } from "@/components/ui/top-menu/TopMenu";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <TopMenu />
      <SideMenu />
      <div className="px-0 sm:px-7">{children}</div>
      <Footer />
    </main>
  );
}
