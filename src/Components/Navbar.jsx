"use client";
import { navigation } from "@/constants";
import { useState } from "react";
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
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
const Navbar = ({ relative, hidden, classic }) => {
  const navRef = useRef(null);

  const { isAdmin, router, user } = useAppContext();
  const pathname = usePathname();

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

  // if (adminLoading) {
  //   return <Loading />
  // }
  return (
    <div
      className={`
        ${relative ? "relative" : "fixed"} ${hidden ? "hidden" : "block"} ${
        classic ? "border-black bg-black" : "lg:backdrop-blur-sm"
      } w-full top-0 left-0 right-0 border-b border-n-6 lg:bg-n-8/90 z-50 ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem]" href="/">
          {/* <Image src={brainwave} alt="Brainwave Logo" width={190} height={40} /> */}

          <FontAwesomeIcon
            icon={faDroplet}
            className="mr-3 inline-block w-6 h-6 text-cyan-600"
          />
          <h1 className="inline-block tracking-wider text-2xl font-mono text-neutral-50">
            VelvetDrop
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
                className={`block uppercase relative font-code text-2xl text-n-1 transition-colors hover:text-color-1 cursor-pointer ${
                  item.onlyMobile ? "lg:hidden" : ""
                } ${
                  item.url === pathname.hash
                    ? "z-2 lg:text-n-1"
                    : "lg:text-n-1/50"
                } font-poppins px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 lg:hover:text-orange-500 xl:px-12`}
              >
                {item.clerk ? (
                  user ? (
                    <SignOutButton />
                  ) : (
                    <SignInButton mode="modal">{item.title}</SignInButton>
                  )
                ) : item.admin ? (
                  isAdmin ? (
                    <span className="border border-orange-500 rounded-[1rem] p-2">
                      {item.title}
                    </span>
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
