import { titleFont } from "@/config/fonts";

export default function Home() {
  return (
    <main>
      <h1>Hello World!!!</h1>
      <h1 className={titleFont.className}>Hello World but different!!!</h1>
    </main>
  );
}
