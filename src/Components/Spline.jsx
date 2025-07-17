import React from "react";
import Spline from "@splinetool/react-spline";

const SplineFile = () => {
  const isLargeScreen =
    typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <>
      {isLargeScreen && (
        <div className="-mt-[200px] xl:-mt-[300px] invisible lg:visible lg:flex pointer-events-none">
          <Spline scene="https://draft.spline.design/tJ7jNGEoO5MyV8zW/scene.splinecode" />
          {/* <Spline scene="https://draft.spline.design/J4nZSUnG-ZA1l2q0/scene.splinecode" /> */}
          {/* <Spline scene="https://prod.spline.design/qucBCCv5Vs5-ey8b/scene.splinecode" /> */}
        </div>
      )}
    </>
  );
};

export default SplineFile;
