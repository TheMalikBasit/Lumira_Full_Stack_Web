"use client";
import { useClerk } from "@clerk/nextjs";
import DefaultStyler from "./DefaultStyler";
import { SignInButton } from "@clerk/nextjs";
import Button from "./Button";

const Hero = () => {
  return (
    <DefaultStyler
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPadding
      id="#hero"
    >
      <div className="container">
        <Button href={`#login`}>Gradiant</Button>
      </div>
    </DefaultStyler>
  );
};

export default Hero;
