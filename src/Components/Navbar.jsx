"use client";
import { useToggleMode } from "../../models/ToggleMode";
import { navigation } from "@/constants";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HamburgerMenu } from "./design/Header";
import { brainwave } from "../assets";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useRef } from "react";
import Image from "next/image";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/Context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faDroplet,
  faLightbulb,
  faFireFlameCurved,
} from "@fortawesome/free-solid-svg-icons";
import { assets } from "../assets/assets";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  faPiedPiper,
  faPiedPiperHat,
} from "@fortawesome/free-brands-svg-icons";
import BackLights from "./BackLights";
const Navbar = ({ relative, hidden, classic, bgBlur }) => {
  const navRef = useRef(null);
  const pathname = usePathname();
  const ToggleMode = useToggleMode();
  const { isAdmin, router, user, darkMode } = useAppContext();
  const [openNavigation, setopenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setopenNavigation(false);
      enableBodyScroll(navRef.current);
    } else {
      setopenNavigation(true);
      disableBodyScroll(navRef.current);
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    setopenNavigation(false);
    enableBodyScroll(navRef.current);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#000000";
      console.log("From Cart darkMode: ", darkMode);
    } else {
      document.body.style.backgroundColor = "#FFFFF4";
      console.log("From Cart !darkMode: ", darkMode);
    }
  }, [darkMode]);

  // if (adminLoading) {
  //   return <Loading />
  // }
  return (
    <div
      className={`
        ${relative ? "relative" : "fixed"} ${hidden ? "hidden" : "block"} ${
        classic ? "border-black" : ""
      } ${
        bgBlur
          ? "backdrop-blur-xl border-b border-black        npm cache clean --force"
          : ""
      } w-full top-0 left-0 right-0  z-50`}
    >
      <div className="flex items-center px-5 lg:px-[75px] xl:px-40 max-lg:py-4">
        <a className="flex flex-row items-center w-[12rem]" href="/">
          {/* <Image src={brainwave} alt="Brainwave Logo" width={190} height={40} /> */}
          <div className="max-w-2xl">
            <FontAwesomeIcon
              className="mr-3 text-orange-400"
              icon={faFireFlameCurved}
              size="2xl"
            />
          </div>
          <h1
            className={`${
              darkMode ? "text-fill-hover-dark" : "text-fill-hover"
            } tracking-wider text-2xl font-bold font-serif`}
            data-text="Lumira"
          >
            Lumira
          </h1>
        </a>
        <nav
          ref={navRef}
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed left-0 right-0 bottom-0 top-[5rem] bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center lg:flex-row m-auto">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block uppercase relative font-ubuntu text-xl text-n-1 transition-colors cursor-pointer ${
                  item.onlyMobile ? "lg:hidden" : ""
                } ${
                  item.url === pathname
                    ? "z-2 lg:text-orange-500"
                    : darkMode
                    ? "lg:text-n-1"
                    : "lg:text-neutral-950"
                } px-6 py-6 md:py-8 lg:mr-2 lg:text-sm lg:font-semibold lg:leading-5  lg:hover:text-orange-500 xl:px-10`}
              >
                {item.clerk ? (
                  user ? (
                    <SignOutButton />
                  ) : (
                    <SignInButton mode="modal">{item.title}</SignInButton>
                  )
                ) : item.admin ? (
                  isAdmin ? (
                    <p className="border border-orange-500 rounded-[1rem] p-2">
                      {item.title}
                    </p>
                  ) : null
                ) : (
                  item.title
                )}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>
        {/* <a
          href="#signup"
          className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
          New Account
        </a> */}
        {darkMode ? (
          <button
            onClick={ToggleMode}
            className="max-w-2xl cursor-pointer Z-10"
          >
            <FontAwesomeIcon
              className="mr-3 text-white"
              icon={faMoon}
              size="2xl"
            />
          </button>
        ) : (
          <button
            onClick={ToggleMode}
            className="max-w-2xl cursor-pointer Z-10"
          >
            <FontAwesomeIcon
              className="mr-3 text-orange-500"
              icon={faSun}
              size="2xl"
            />
          </button>
        )}
        <Button clerk user={user} router={router} className="hidden lg:flex">
          Sign IN
        </Button>
        <Button
          onclick={toggleNavigation}
          className="ml-auto lg:hidden"
          px="px-3"
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
