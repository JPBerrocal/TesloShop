import { titleFont } from "@/config/fonts";

export default function Home() {
  return (
    <div>
      <div>Hello World!!!</div>
      <h1 className={titleFont.className}>Hello World but different!!!</h1>
    </div>
  );
}
