"use client";
import React from "react";
import { useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import Image from "next/image";
import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import { LottieLoading } from "@/Components/Loading";
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
import Navbar from "@/Components/Navbar";
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
    loading,
    setLoading,
  } = useAppContext();
  const { isSignedIn } = useUser();
  const [CART, setCART] = useState([]);

  useEffect(() => {
    if (cartItems === undefined || cartItems === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (darkMode) {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "#FFFFF4";
    }

    const tempCart = isSignedIn ? cartItems : localCart;
    setCART(tempCart);
  }, [cartItems, darkMode, isSignedIn]);

  return (
    <>
      <Navbar bgBlur />
      <div className="min-h-screen relative overflow-hidden mt-20">
        <BackLights L2 />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex justify-between gap-6 mb-16">
            <div className="flex flex-col w-full text-center md:text-start md:flex-row space-y-3 md:space-y-0">
              <div
                onClick={() => {
                  router.push("/my-products");
                }}
                className="text-left"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover-scale shadow-warm hover:shadow-glow transition-all duration-300 border border-n-foreground"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 mx-auto md:ml-4">
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
          {loading ? (
            <>
              {" "}
              <LottieLoading className={"min-h-screen relative"} />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8 ">
                  <RenderCart />
                </div>
                <div className="lg:col-span-1">
                  <OrderSummaryClassic />
                </div>
              </div>
            </>
          )}
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
