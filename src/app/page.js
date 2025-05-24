import Hero from "@/Components/Hero";
import Navbar from "@/Components/Navbar";
// import { hello } from "wall"
export default function Home() {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Navbar />
      <Hero />
    </div>
  );
}

{
  /* <div className="absolute inset-0 blur-3xl bg-cover bg-main-background bg-no-repeat bg-center h-screen -z-10" /> */
}
