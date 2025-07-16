import React from "react";
import Spline from "@splinetool/react-spline";

const SplineFile = () => {
  const isLargeScreen =
    typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <>
      {isLargeScreen && (
        <div className="-mt-[300px] flex pointer-events-none -z-50">
          <Spline scene="https://draft.spline.design/tJ7jNGEoO5MyV8zW/scene.splinecode" />
        </div>
      )}
    </>
  );
};

export default SplineFile;
