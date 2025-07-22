"use client";
import React from "react";
// import LottieAnimation from "../../public/LottieLoading.json";
// import { LottiePlayer } from "lottie-react";
// import Lottie from "lottie-react";
import Lottie from "lottie-react";
import ComponentLoadingAnimation from "../../public/ComponentLoadingAnimation.json";
import LottieLoadingAnimation from "../../public/LottieLoadingAnimation.json";
export const Loading = () => {
  return (
    <div className="h-full bg-gradient-radial from-[#3C4B57] to-[#1C262B] bg-[radial-gradient(circle_farthest-corner_at_center,_#3C4B57_0%,_#1C262B_100%)]">
      <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full perspective-[800px]">
        <div className="absolute w-full h-full rounded-full box-border border-b-[3px] border-[#EFEFFA] animate-rotate-one"></div>
        <div className="absolute w-full h-full rounded-full box-border border-r-[3px] border-[#EFEFFA] animate-rotate-two"></div>
        <div className="absolute w-full h-full rounded-full box-border border-t-[3px] border-[#EFEFFA] animate-rotate-three"></div>
      </div>
    </div>
  );
};

export const LoadingDiv = () => {
  return (
    <section className="mx-auto flex w-full items-center justify-center">
      <span className="relative inline-block w-[40px] h-[40px] rounded-full bg-gradient-to-t from-[rgba(255,0,0,0.2)] via-[rgba(255,0,0,0.2)] to-[rgba(255,0,0,1)] animate-spin-slow">
        <span className="absolute left-1/2 top-1/2 w-[36px] h-[36px] rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2"></span>
      </span>
      Loading
    </section>
  );
};

export const LottieLoading1 = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Lottie
          animationData={LottieLoadingAnimation}
          loop
          autoplay
          aria-label="Loading animation"
        />
      </div>
    </div>
  );
};

export const LottieLoading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Lottie
          animationData={ComponentLoadingAnimation}
          loop
          autoplay
          aria-label="Loading animation"
          style={{ width: "500px", height: "500px" }}
        />
      </div>
    </div>
  );
};
