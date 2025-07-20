"use client";
import React, { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";

const SplineFile = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLargeScreen(window.innerWidth >= 1024);
    }
  }, []);

  return (
    <>
      {isLargeScreen && (
        <div
          id="spline-container"
          className={`transition-opacity duration-700 ease-in-out -mt-[200px] xl:-mt-[300px] ${
            isLoaded
              ? "opacity-100 invisible lg:visible lg:flex "
              : "opacity-0 invisible"
          } pointer-events-none -z-10 lg:flex`}
        >
          <Spline
            scene="https://draft.spline.design/tJ7jNGEoO5MyV8zW/scene.splinecode"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      )}
    </>
  );
};

export default SplineFile;
// Version 1 of spline optimization
// import React from "react";
// import Spline from "@splinetool/react-spline";

// const SplineFile = () => {
//   const isLargeScreen =
//     typeof window !== "undefined" && window.innerWidth >= 1024;

//   return (
//     <>
//       {isLargeScreen && (
//         <div className="-mt-[200px] xl:-mt-[300px] invisible lg:visible lg:flex pointer-events-none">
//           <Spline scene="https://draft.spline.design/tJ7jNGEoO5MyV8zW/scene.splinecode" />
//         </div>
//       )}
//     </>
//   );
// };

// export default SplineFile;

// Version 2 of spline optimization
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Spline from "@splinetool/react-spline";

// const SplineFile = () => {
//   const [isLargeScreen, setIsLargeScreen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const splineRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setIsLargeScreen(window.innerWidth >= 1024);

//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.3 }
//       );

//       if (splineRef.current) {
//         observer.observe(splineRef.current);
//       }

//       return () => observer.disconnect();
//     }
//   }, []);

//   return (
//     <>
//       {isLargeScreen && (
//         <>
//           {!isVisible && <div className="mt-0" />}
//           {isVisible && (
//             <div
//               id="spline-container"
//               className="-mt-[200px] xl:-mt-[300px] invisible lg:visible lg:flex pointer-events-none -z-10"
//             >
//               <Spline scene="https://prod.spline.design/KxJUVkByTh2t2Ilj/scene.splinecode" />
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default SplineFile;
// All models of spline I have
// <Spline scene="https://draft.spline.design/J4nZSUnG-ZA1l2q0/scene.splinecode" />
//           {/* <Spline scene="https://prod.spline.design/qucBCCv5Vs5-ey8b/scene.splinecode" />
// https://draft.spline.design/t1QxU-s7pl7D3rio/scene.splinecode
