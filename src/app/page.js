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

export default function Home() {
  const [showVideo, setShowVideo] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 4000); // Start fade after 5s
    const removeTimer = setTimeout(() => setShowVideo(false), 6000); // Remove after fade
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);
  return (
    <>
      {showVideo && (
        <div
          className={`pointer-events-none fixed inset-0 flex items-center justify-center bg-black transition-opacity z-20 duration-1000 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <video
            src="/GradientVideo.mp4"
            autoPlay
            muted
            className="w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
          />
        </div>
      )}
      <BackLights L1 />
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Navbar bgBlur />
        <Hero />
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
