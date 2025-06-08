import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const BackLights = ({ L1, L2, L3 }) => {
  const lightRef = useRef(null);
  const lightRef2 = useRef(null);
  const lightRef3 = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      lightRef.current,
      { y: -10, x: 120 },
      {
        x: 320,
        repeat: -1,
        yoyo: true,
        duration: 10,
        ease: "power4.inOut",
      }
    );
    gsap.fromTo(
      lightRef2.current,
      { y: 100 },
      { y: "50vh", repeat: -1, yoyo: true, duration: 10, ease: "circ.inOut" }
    );
    gsap.fromTo(
      lightRef3.current,
      { y: "50vh" },
      {
        y: "80vh",
        delay: 5,
        repeat: -1,
        yoyo: true,
        duration: 10,
        ease: "circ.inOut",
      }
    );
  }, []);
  return (
    <div className="absolute w-full">
      <div
        ref={lightRef}
        className={`${L1 ? "lg:flex" : "hidden"} 
        mt-8 w-16 h-16 rounded-full bg-orange-300 opacity-100 blur-lg -z-10`}
      />
      <div
        ref={lightRef2}
        className={`${
          L2 ? "flex" : "hidden"
        } box fixed right-20 w-20 h-20 rounded-full opacity-100 blur-md -z-10`}
      />
      <div
        ref={lightRef3}
        className={`${
          L3 ? "flex" : "hidden"
        } box fixed left-20 w-20 h-20 rounded-full opacity-100 blur-md -z-10`}
      />
    </div>
  );
};

export default BackLights;
