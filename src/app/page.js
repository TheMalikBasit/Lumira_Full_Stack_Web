"use client";
import Hero from "@/Components/Hero";
import Navbar from "@/Components/Navbar";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import { useEffect, useState } from "react";
import BackLights from "@/Components/BackLights";
import SplineFile from "@/Components/Spline";
import Collections from "@/Components/Collections";
import Footer from "@/Components/LumiraFooter";
import ProductHighlights from "@/Components/ProductsHighlights";
import { useAppContext } from "@/Context/AppContext";
export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("introPlayed");

    if (!hasPlayed) {
      setShowVideo(true);

      const fadeTimer = setTimeout(() => setFade(true), 4000);
      const removeTimer = setTimeout(() => {
        setShowVideo(false);
        sessionStorage.setItem("introPlayed", "true");
      }, 6000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  return (
    <>
      {showVideo && (
        <div
          className={`pointer-events-none fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-1000 z-50 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <video
            src="/GradientVideo.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
            onEnded={() => setFade(true)} // fallback in case fadeTimer fails
          />
        </div>
      )}

      <BackLights L1 />
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Navbar bgBlur />
        <Hero />
        <Collections />
        <ProductHighlights />
        {/* <FooterOne crosses />
        <FooterTwo crosses /> */}
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
}

{
  /* <div className="absolute inset-0 blur-3xl bg-cover bg-main-background bg-no-repeat bg-center h-screen -z-10" /> */
}
