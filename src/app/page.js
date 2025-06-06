"use client";
import Hero from "@/Components/Hero";
import Navbar from "@/Components/Navbar";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Navbar />
        <Hero />
        <FooterOne crosses />
        <FooterTwo crosses />
      </div>
      <ButtonGradient />
    </>
  );
}

{
  /* <div className="absolute inset-0 blur-3xl bg-cover bg-main-background bg-no-repeat bg-center h-screen -z-10" /> */
}
