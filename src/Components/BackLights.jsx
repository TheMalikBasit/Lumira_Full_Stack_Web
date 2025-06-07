import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const BackLights = () => {
  const lightRef = useRef(null);
  const lightRef2 = useRef(null);
  useGSAP(() => {
    gsap.fromTo(
      lightRef.current,
      { y: -10, x: 120 },
      {
        x: 320,
        repeat: -1,
        yoyo: true,
        duration: 5,
        ease: "power4.inOut",
      }
    );
    gsap.fromTo(
      lightRef2.current,
      { y: 100 },
      { y: "50vh", repeat: -1, yoyo: true, duration: 10, ease: "circ.inOut" }
    );
  }, []);
  return (
    <div className="absolute w-full">
      <div
        ref={lightRef}
        className="fixed top-10 w-16 h-16 rounded-full bg-orange-300 opacity-80 blur-xl -z-10"
      />
      <div
        ref={lightRef2}
        className="box fixed right-20 w-20 h-20 rounded-full opacity-100 blur-xl -z-10"
      />
    </div>
  );
};

export default BackLights;
