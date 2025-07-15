"use client";
import DefaultStyler from "./DefaultStyler";
import Button from "./Button";
import { useRouter } from "next/navigation"; //This also works
import { useAppContext } from "../Context/AppContext";
import { useUser } from "@clerk/nextjs";
import AllProducts from "@/app/all-products/page";
import SplineFile from "./Spline";
import { ArrowRight, Play } from "lucide-react";
const Hero = () => {
  const { router } = useAppContext();

  const { user } = useUser();
  const handleClick = () => {
    console.log("ID = ", user.id);
    console.log("Username = ", user.fullName);
    console.log("Email = ", user.primaryEmailAddress.emailAddress);
    console.log("Image = ", user.imageUrl);
    // console.log(user);
  };
  return (
    <div className="w-full">
      <div className="container mt-[100px]">
        {/* <Button onclick={handleClick}>Gradiant</Button> */}
        <div className="space-y-4">
          <h1
            style={{ fontFamily: "sans-serif" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-n-14 leading-tight"
          >
            Illuminate Your
            <span className="text-n-spaceGradient block">Perfect Space</span>
          </h1>
          <p className="text-lg sm:text-xl text-n-mutedforeground max-w-lg">
            Discover LUMIRA's collection of premium lighting solutions that
            blend modern design with exceptional functionality for your home and
            office.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="mt-10 xl:mt-0 flex flex-row items-center group hover:text-pink-600">
            Shop Collection
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button className="mt-10 xl:mt-0">
            <Play className="mr-2 h-4 w-4" /> Watch Demo
          </Button>
        </div>
      </div>
      <SplineFile />
    </div>
  );
};

export default Hero;
