"use client";
import { useClerk } from "@clerk/nextjs";
import DefaultStyler from "./DefaultStyler";
import { SignInButton } from "@clerk/nextjs";
const Hero = () => {
  const { openSignin } = useClerk();
  return (
    <DefaultStyler
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPadding
      id="#hero"
    >
      <div className="container">
        <SignInButton mode="modal">
          <button onClick={openSignin} className="btn btn-primary">
            Sign In
          </button>
        </SignInButton>
      </div>
    </DefaultStyler>
  );
};

export default Hero;
