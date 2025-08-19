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
import SelectCurrency from "./SelectCurrency";
import { useUser } from "@clerk/nextjs";
import {
  X,
  Globe,
  Check,
  LogInIcon,
  User,
  User2,
  UserCircle,
  UserCircle2,
  UserCheck,
  UserCheck2,
  Globe2,
  GlobeLock,
  LucideGlobe,
  LucideGlobe2,
  Languages,
  Hamburger,
} from "lucide-react";
import {
  Package,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Calendar,
  CreditCard,
  BaggageClaim,
  ShoppingBag,
} from "lucide-react";
import { BagIcon, CartIcon } from "@/assets/assets";
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
import { Loading, LottieLoading } from "./Loading"; // Import your loading animation
const Navbar = ({ relative, hidden, classic, bgBlur }) => {
  const navRef = useRef(null);
  const pathname = usePathname();
  const ToggleMode = useToggleMode();
  const { isAdmin, router, user, darkMode, loading, setLoading } =
    useAppContext();
  const [openNavigation, setopenNavigation] = useState(false);

  const [showCurrency, setshowCurrency] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isToggled");
      if (stored) {
        setshowCurrency(false);
      } else {
        setshowCurrency(true);
      }
    }
  });

  const toggleNavigation = () => {
    if (openNavigation) {
      setopenNavigation(false);
      enableBodyScroll(navRef.current);
    } else {
      setopenNavigation(true);
      disableBodyScroll(navRef.current);
    }
  };

  const toggleCurrency = (option) => {
    if (option) {
      setshowCurrency(option);
    } else {
      setshowCurrency(!showCurrency);
    }
  };

  const handleClick = (url) => {
    if (url != undefined) {
      setLoading(true);
      window.location.href = url;
    } else {
      return;
    }
  };

  const handleLinkClick = () => {
    if (!openNavigation) return;

    setopenNavigation(false);
    enableBodyScroll(navRef.current);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "#FFFFF4";
    }
  }, [darkMode]);

  if (loading) <LottieLoading />;
  return (
    <>
      {showCurrency && <SelectCurrency toggleCurrency={showCurrency} />}
      <div
        className={`
        ${relative ? "relative" : "fixed"} ${hidden ? "hidden" : "block"} ${
          classic ? "border-black" : ""
        } w-full top-0 left-0 right-0 z-40`}
      >
        {bgBlur && (
          <div className="absolute inset-0 backdrop-blur-xl z-[-100] pointer-events-none" />
        )}
        <div
          className={` flex items-center px-5 sm:px-10 lg:px-[75px] xl:px-40 max-lg:py-3`}
        >
          <a className="flex flex-row items-center w-[12rem]" href="/">
            {/* <Image src={brainwave} alt="Brainwave Logo" width={190} height={40} /> */}
            <div className="max-w-2xl">
              <FontAwesomeIcon
                className="mr-3 text-orange-400"
                icon={faFireFlameCurved}
                size="xl"
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
            } fixed left-0 right-0 bottom-0 top-[4.1rem] lg:static lg:flex lg:mx-auto`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center lg:flex-row m-auto">
              <button className="lg:hidden relative inline-flex justify-center border-2 border-orange-500 rounded-full p-[2px]">
                {isSignedIn ? (
                  <>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-9 h-9", // Adjust width & height
                        },
                      }}
                    >
                      <UserButton.MenuItems>
                        <UserButton.Action
                          label="Cart"
                          labelIcon={<CartIcon />}
                          onClick={() => router.push("/cart")}
                        />
                        <UserButton.Action
                          label="My Orders"
                          labelIcon={<BagIcon />}
                          onClick={() => router.push("/order-history")}
                        />
                        {isAdmin && (
                          <UserButton.Action
                            label="Admin Dashboard"
                            labelIcon={<User />}
                            onClick={() => router.push("/admin")}
                          />
                        )}
                      </UserButton.MenuItems>
                    </UserButton>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <span className={` hover:text-orange-800`}>
                        <User />
                      </span>
                    </SignInButton>
                  </>
                )}
              </button>
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(item.url);
                  }}
                  className={`block uppercase relative font-ubuntu text-xl text-n-foreground transition-colors cursor-pointer ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } ${
                    item.url === pathname
                      ? "z-2 lg:text-orange-500 text-stone-900"
                      : darkMode
                      ? "lg:text-n-1"
                      : "lg:text-neutral-950"
                  } px-6 py-6 md:py-6 xl:px-10 lg:mr-2 lg:text-sm lg:font-semibold lg:leading-5 hover:text-white lg:hover:text-orange-500`}
                >
                  {item.clerk ? (
                    user ? (
                      <SignOutButton />
                    ) : (
                      <SignInButton mode="modal">{item.title}</SignInButton>
                    )
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
          {/* {darkMode ? (
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
          )} */}
          <div className="flex flex-row ml-auto">
            <button
              onClick={() => router.push("/order-history")}
              className="max-w-2xl cursor-pointer Z-10 mr-5"
            >
              <ShoppingBag className="w-5 h-5 md:w-auto md:h-auto" />
            </button>
            <button
              onClick={toggleCurrency}
              className="max-w-2xl cursor-pointer Z-10 mr-5"
            >
              <Languages className="w-5 h-5 md:w-auto md:h-auto" />
            </button>
            <Button
              clerk
              user={user}
              router={router}
              isAdmin={isAdmin}
              className="hidden lg:flex"
            >
              <User />
            </Button>
            <Button
              onclick={toggleNavigation}
              className="ml-auto lg:hidden"
              px="px-3"
              none
            >
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
