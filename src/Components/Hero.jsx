"use client";
import DefaultStyler from "./DefaultStyler";
import Button from "./Button";
import { useRouter } from "next/navigation"; //This also works
import { useAppContext } from "../Context/AppContext";
const Hero = () => {
  const { router } = useAppContext();

  const handleClick = () => {
    router.push("/cart");
  };
  return (
    <DefaultStyler
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPadding
      id="#hero"
    >
      <div className="container">
        <Button onclick={handleClick}>Gradiant</Button>
      </div>
    </DefaultStyler>
  );
};

export default Hero;
