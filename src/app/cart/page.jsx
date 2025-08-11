"use client";
import React from "react";
import { useEffect } from "react";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import { useAppContext } from "../../Context/AppContext";
import Image from "next/image";
import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import { Loading, LottieLoading } from "@/Components/Loading";
import { useState } from "react";
import OrderSummaryClassic from "@/Components/OrderSummaryClassic";
import BackLights from "@/Components/BackLights";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserDetails from "@/Components/UserDetails";
import AddAddressComponent from "@/Components/AddAddressComponent";
import { useUser } from "@clerk/nextjs";
import Footer from "@/Components/LumiraFooter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import {
  fetchLocalCart,
  addLocalProducts,
  removeLocalProducts,
  deleteLocalProducts,
} from "../../../models/OfflineModules";
import RenderCart from "@/Components/RenderCart";
const cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    setCartItems,
    toggleItemChecked,
    removeItemFromCart,
    currency,
    darkMode,
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    deleteFromLocalCart,
  } = useAppContext();
  const { isSignedIn } = useUser();
  const [loading, setloading] = useState(true);
  const [addAddressPopUp, setaddAddressPopUp] = useState(false);
  const [CART, setCART] = useState([]);

  useEffect(() => {
    if (cartItems === undefined || cartItems === null) {
      setloading(true);
    } else {
      setloading(false);
    }

    if (darkMode) {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "#FFFFF4";
    }

    const tempCart = isSignedIn ? cartItems : localCart;
    setCART(tempCart);
  }, [cartItems, darkMode, isSignedIn]);

  if (loading) return <LottieLoading />;

  return (
    <>
      <BackLights L2 />

      <Navbar bgBlur />
      <div className="min-h-screen relative overflow-hidden mt-20">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center gap-6 mb-16">
            <div
              onClick={() => {
                router.push("/my-products");
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover-scale shadow-warm hover:shadow-glow transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1">
              <h1 className="text-5xl font-bold text-n-foreground mb-3 animate-fade-in">
                Shopping Cart
              </h1>
              <p
                className="text-n-muted_foreground text-lg animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                {CART.length} {CART.length === 1 ? "item" : "items"} ready for
                checkout
              </p>
            </div>
            <div
              className="hidden md:flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <div className="text-right">
                <p className="text-sm text-n-muted_foreground">Total Items</p>
                <p className="text-2xl font-bold text-n-foreground">
                  {CART.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8 ">
              <RenderCart />
            </div>
            <div className="lg:col-span-1">
              <OrderSummaryClassic />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default cart;

{
  /* <FooterOne padLinesHide white />
      <div
        className={`w-full border border-t ${
          darkMode ? "border-white" : "border-black"
        } my-5`}
      />
      <div
        className={`w-full border border-t ${
          darkMode ? "border-white" : "border-black"
        } my-5`}
      />
      <FooterTwo padLinesHide white /> */
}
