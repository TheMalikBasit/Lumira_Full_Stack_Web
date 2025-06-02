"use client";
import React from "react";
import { useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import { useAppContext } from "../../Context/AppContext";
import Image from "next/image";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import Loading from "@/Components/Loading";
import { useState } from "react";
import OrderSummaryClassic from "@/Components/OrderSummaryClassic";
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
  } = useAppContext();

  const [loading, setloading] = useState(true);
  useEffect(() => {
    const original = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#fff"; // Your desired color

    if (cartItems === undefined || cartItems === null) {
      setloading(true);
    } else {
      setloading(false);
    }

    return () => {
      document.body.style.backgroundColor = original; // Restore on unmount
    };
  }, [cartItems]);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar relative classic />
      <div className="w-full min-h-[60rem] pb-10">
        <h1 className="px-32 ml-10 h1 font-code text-neutral-950 pt-10">
          SHOPPING CART
        </h1>
        <div className="w-full border border-t border-black my-10" />
        <div className="flex flex-col lg:flex-row w-full">
          <div className="w-[75rem] px-32">
            <button
              onClick={() => router.push("/all-products")}
              className="hover:text-orange-500 group flex items-center ml-10 mb-5 gap-2 text-2xl font-poppins font-bold text-black underline"
            >
              Continue Shopping
            </button>
            {cartItems?.length > 0 ? (
              <div className="">
                <div className="overflow-y-auto max-h-[44.4rem] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300">
                  {cartItems.map((item) => {
                    const product = products.find(
                      (product) => product.id === item.itemId
                    );

                    if (!product) return null;

                    return (
                      <div
                        key={item.itemId}
                        className="border-b border-black w-full"
                      >
                        <div className="flex flex-row w-full p-10">
                          <button
                            type="button"
                            onClick={() => toggleItemChecked(item.itemId)}
                            className="text-2xl md:text-4xl mr-5"
                            aria-pressed={item.checked}
                          >
                            <FontAwesomeIcon
                              icon={item.checked ? faCheckSquare : faSquare}
                              className="text-black"
                            />
                          </button>

                          <div
                            className="border border-black p-8 mr-5 cursor-pointer"
                            onClick={() =>
                              router.push("/product/" + product.id)
                            }
                          >
                            <Image
                              src={product.mainImage}
                              width={130}
                              height={130}
                              alt={product.name}
                            />
                          </div>
                          <div className="flex flex-col w-full justify-around">
                            <div className="flex w-full justify-between items-center mb-6">
                              <h2
                                onClick={() =>
                                  router.push("/product/" + product.id)
                                }
                                className="font-mono font-bold text-black text-2xl cursor-pointer"
                              >
                                {product.name}
                              </h2>
                              <button
                                onClick={() =>
                                  updateCartQuantity(product.id, 0)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faXmark}
                                  className="text-black top-0 right-0"
                                  size="xl"
                                />
                              </button>
                            </div>
                            <div className="mb-6 flex flex-row justify-between">
                              <div className="p-2 border border-black w-20">
                                <h2 className="text-black">Hello</h2>
                              </div>
                              <div className="p-2 border border-black w-20">
                                <h2 className="text-black">Hello</h2>
                              </div>
                              <div className="p-2 border border-black w-24 flex justify-between items-center">
                                <button
                                  className="text-black font-code text-lg font-bold"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.itemId,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </button>
                                <h1 className="font-poppins font-bold text-black">
                                  {item.quantity}
                                </h1>
                                <button
                                  className="text-black font-code text-lg font-bold"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.itemId,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between items-center w-full">
                              <h1 className="font-poppins font-bold text-black underline cursor-pointer">
                                MOVE TO FAVOURITES
                              </h1>
                              <h1 className="font-poppins font-bold text-black">
                                {currency} <span> </span>
                                {(product.price * item.quantity).toFixed(2)}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="font-poppins text-2xl text-black underline cursor-pointer ml-40">
                Your cart is empty.
              </p>
            )}
          </div>
          <div className="mt-15">
            <OrderSummaryClassic />
          </div>
        </div>
      </div>
      <div className="w-full border border-t border-black my-5" />
      <FooterOne padLinesHide white />
      <div className="w-full border border-t border-black my-5" />
      <FooterTwo padLinesHide white />
    </>
  );
};

export default cart;
