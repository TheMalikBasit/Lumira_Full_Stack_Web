"use client";
import DefaultStyler from "./DefaultStyler";
import Button from "./Button";
import { useRouter } from "next/navigation"; //This also works
import { useAppContext } from "../Context/AppContext";
import { useUser } from "@clerk/nextjs";
import AllProducts from "@/app/all-products/page";
import SplineFile from "./Spline";
import { ArrowRight, Play } from "lucide-react";
import Collections from "./Collections";
import ProductHighlights from "./ProductsHighlights";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRef } from "react";
const Hero = () => {
  const { router } = useAppContext();

  const { user } = useUser();

  const videoRef = useRef(null);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="container mt-[100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-n-foreground leading-tight">
                Illuminate Your
                <span className="text-n-spaceGradient block">
                  Perfect Space
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-n-muted_foreground max-w-lg">
                Discover LUMIRA's collection of premium lighting solutions that
                blend modern design with exceptional functionality for your home
                and office.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="warm" className="group">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                onclick={togglePlayPause}
                size="lg"
                variant="outline"
                className="group"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-n-primary">50K+</div>
                <div className="text-sm text-n-muted_foreground">
                  Happy Customers
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-n-primary">200+</div>
                <div className="text-sm text-n-muted_foreground">
                  Premium Designs
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-n-primary">99%</div>
                <div className="text-sm text-n-muted_foreground">
                  Satisfaction Rate
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 animate-float">
              {/* <Image
                src={assets.studyLamp}
                alt="Premium LUMIRA desk lamp with warm lighting"
                className="w-full h-auto glow-effect rounded-2xl"
              /> */}
              <video
                ref={videoRef}
                src="/LumiraLandingVideo.mp4"
                controls
                className="w-full h-full object-cover rounded-2xl"
                style={{ pointerEvents: "auto" }}
                controlsList="nodownload nofullscreen noremoteplayback"
              />
              <style jsx>{`
                video::-webkit-media-controls-timeline {
                  display: none;
                }
                video::-webkit-media-controls-seek-back-button,
                video::-webkit-media-controls-seek-forward-button {
                  display: none;
                }
              `}</style>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-n-lumira_coral/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-n-lumira_salmon/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
      <SplineFile />
    </div>
  );
};

export default Hero;
