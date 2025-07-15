"use client";
import React from "react";
import { useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import { useAppContext } from "../../Context/AppContext";
import Image from "next/image";
import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import Loading from "@/Components/Loading";
import { useState } from "react";
import OrderSummaryClassic from "@/Components/OrderSummaryClassic";
import BackLights from "@/Components/BackLights";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserDetails from "@/Components/UserDetails";
import AddAddressComponent from "@/Components/AddAddressComponent";
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
  } = useAppContext();

  const [loading, setloading] = useState(true);
  const [addAddressPopUp, setaddAddressPopUp] = useState(false);
  useEffect(() => {
    if (cartItems === undefined || cartItems === null) {
      setloading(true);
    } else {
      setloading(false);
    }

    if (darkMode) {
      document.body.style.backgroundColor = "#000000";
      console.log("From Cart darkMode: ", darkMode);
    } else {
      document.body.style.backgroundColor = "#FFFFF4";
      console.log("From Cart !darkMode: ", darkMode);
    }
  }, [cartItems, darkMode]);

  // useGSAP(() => {
  //   if (!loading) {
  //     gsap.to("#shopping", {
  //       x: 300,
  //       duration: 5,
  //       repeat: -1,
  //       yoyo: true,
  //       ease: "power1.in",
  //     });
  //   }
  // }, [loading]);

  if (loading) return <Loading />;

  return (
    <>
      <BackLights L1 L2 />
      <Navbar relative classic />

      {addAddressPopUp && (
        <AddAddressComponent onClose={() => setaddAddressPopUp(false)} />
      )}

      <div className="w-full min-h-[60rem] pb-10">
        <h1
          className={`${
            darkMode ? "text-white" : "text-black"
          } text-center lg:text-start lg:ml-20 h1 font-code pt-10`}
        >
          SHOPPING CART
        </h1>
        <div
          className={`${
            darkMode ? "border-white" : "border-black"
          } w-full border border-t my-10`}
        />
        <div className="flex flex-col justify-center lg:justify-normal lg:flex-row w-full px-10 lg:px-20 overflow-hidden">
          <div className="w-full max-w-[75rem] lg:pr-20">
            <button
              onClick={() => router.push("/all-products")}
              className={`hover:text-orange-500 group flex items-center mb-5 gap-2 text-sm  md:text-2xl font-poppins font-bold ${
                darkMode ? "text-white" : "text-black"
              } underline`}
            >
              {/* <div
                className="w-16 h-16 rounded-full bg-white opacity-100 blur-lg -z-10"
                id="shopping"
              /> */}
              Continue Shopping
            </button>
            {cartItems?.length > 0 ? (
              <div
                className={`border ${
                  darkMode ? "border-white" : "border-black"
                } `}
              >
                <div className="overflow-y-auto max-h-[44.4rem] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300">
                  {cartItems.map((item) => {
                    const product = products.find(
                      (product) => product.id === item.itemId
                    );

                    if (!product) return null;

                    return (
                      <div
                        key={item.itemId}
                        className={`border-b w-full ${
                          darkMode ? "border-white" : "border-black"
                        }`}
                      >
                        <div className="flex items-center flex-row w-full p-5 md:p-10">
                          <button
                            type="button"
                            onClick={() => toggleItemChecked(item.itemId)}
                            className="text-2xl md:text-4xl mr-2 md:mr-5"
                            aria-pressed={item.checked}
                          >
                            <FontAwesomeIcon
                              icon={item.checked ? faCheckSquare : faSquare}
                              className={`${
                                darkMode ? "text-white" : "text-black"
                              }`}
                            />
                          </button>

                          <div
                            className="mr-2 md:mr-5"
                            onClick={() =>
                              router.push("/product/" + product.id)
                            }
                          >
                            <Image
                              src={product.mainImage}
                              width={100}
                              height={100}
                              alt={product.name}
                              className={`border ${
                                darkMode ? "border-white" : "border-black"
                              } min-w-[100px] min-h-[100px] w-[200px] cursor-pointer object-contain`}
                            />
                          </div>
                          <div className="flex flex-col w-full justify-around">
                            <div className="flex w-full justify-between items-center mb-2 md:mb-6">
                              <h2
                                onClick={() =>
                                  router.push("/product/" + product.id)
                                }
                                className={`font-mono font-bold ${
                                  darkMode ? "text-white" : "text-black"
                                } text-sm md:text-2xl cursor-pointer`}
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
                                  className={`${
                                    darkMode ? "text-white" : "text-black"
                                  } top-0 right-0 md:text-xl`}
                                  size="sm"
                                />
                              </button>
                            </div>
                            <div className="flex flex-row justify-end md:justify-between mb-2 md:mb-6">
                              <div
                                className={`hidden md:flex p-2 border ${
                                  darkMode ? "border-white" : "border-black"
                                } w-20`}
                              >
                                <h2
                                  className={`${
                                    darkMode ? "text-white" : "text-black"
                                  }`}
                                >
                                  Hello
                                </h2>
                              </div>
                              {/* <div className="hidden md:flex p-2 border border-black w-20">
                                <h2 className=" text-black">Hello</h2>
                              </div> */}
                              <div
                                className={`p-2 border ${
                                  darkMode ? "border-white" : "border-black"
                                } w-24 flex justify-between items-center`}
                              >
                                <button
                                  className={`${
                                    darkMode ? "text-white" : "text-black"
                                  } font-code text-sm md:text-lg font-bold`}
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.itemId,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </button>
                                <h1
                                  className={`font-poppins text-sm md:text-lg font-bold ${
                                    darkMode ? "text-white" : "text-black"
                                  }`}
                                >
                                  {item.quantity}
                                </h1>
                                <button
                                  className={`${
                                    darkMode ? "text-white" : "text-black"
                                  } font-code text-sm md:text-lg font-bold`}
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
                              <h1
                                className={`hidden md:flex text-sm lg:text-lg font-poppins lg:font-bold ${
                                  darkMode ? "text-white" : "text-black"
                                } underline cursor-pointer`}
                              >
                                MOVE TO FAVOURITES
                              </h1>
                              <FontAwesomeIcon
                                icon={faHeart}
                                className={`flex md:hidden ${
                                  item.checked ? "text-red-500" : "text-black"
                                }  text-xl md:text-2xl`}
                              />
                              <h1 className="text-sm  lg:text-lg  font-poppins font-bold text-black">
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
              <p
                className={`font-poppins text-2xl ${
                  darkMode ? "text-white" : "text-black"
                } underline cursor-pointer ml-40`}
              >
                Your cart is empty.
              </p>
            )}
          </div>

          <div className="mt-[3.3rem] lg:pr-10">
            <UserDetails openAddAddress={() => setaddAddressPopUp(true)} />
            <OrderSummaryClassic />
          </div>
        </div>
      </div>
      <div
        className={`w-full border border-t ${
          darkMode ? "border-white" : "border-black"
        } my-5`}
      />
      <FooterOne padLinesHide white />
      <div
        className={`w-full border border-t ${
          darkMode ? "border-white" : "border-black"
        } my-5`}
      />
      <FooterTwo padLinesHide white />
    </>
  );
};

export default cart;
