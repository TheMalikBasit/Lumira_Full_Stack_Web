"use client";
import DefaultStyler from "./DefaultStyler";
import Button from "./Button";
import { useRouter } from "next/navigation"; //This also works
import { useAppContext } from "../Context/AppContext";
import { useUser } from "@clerk/nextjs";

const Hero = () => {
  const { router } = useAppContext();

  const { user } = useUser();
  const handleClick = () => {
    console.log("ID = ", user.id);
    console.log("Username = ", user.username);
    console.log("Email = ", user.primaryEmailAddress.emailAddress);
    console.log("Image = ", user.imageUrl);
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
