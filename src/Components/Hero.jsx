"use client";
import DefaultStyler from "./DefaultStyler";
import Button from "./Button";
import { useRouter } from "next/navigation"; //This also works
import { useAppContext } from "../Context/AppContext";
import { useUser } from "@clerk/nextjs";
import AllProducts from "@/app/all-products/page";

const Hero = () => {
  const { router } = useAppContext();

  const { user } = useUser();
  const handleClick = () => {
    console.log("ID = ", user.id);
    console.log("Username = ", user.fullName);
    console.log("Email = ", user.primaryEmailAddress.emailAddress);
    console.log("Image = ", user.imageUrl);
    // console.log(user);
  };
  return (
    <div className="container">
      <Button onclick={handleClick}>Gradiant</Button>
    </div>
  );
};

export default Hero;
