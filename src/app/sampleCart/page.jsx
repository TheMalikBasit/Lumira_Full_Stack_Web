"use client";
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import { useAppContext } from "../../Context/AppContext";
import Image from "next/image";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";

const sampleCart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
  } = useAppContext();

  const handleClick = () => {};

  return (
    <>
      <Navbar relative classic />
      <div className="bg-n-1 w-full">
        <h1 className="px-32 h1 font-poppins text-neutral-950 pt-10">
          SHOPPING CART
        </h1>
        <div className="w-full border border-t border-black my-10" />
        <div className="max-w-[75rem] px-32">
          {Object.keys(cartItems).map((itemId) => {
            const product = products.find((product) => product.id === itemId);

            if (!product || cartItems[itemId] <= 0) return null;

            return (
              <div key={itemId} className="border-b border-black w-full">
                <div className="flex flex-row w-full p-10">
                  <div className="border border-black p-8 mr-5">
                    <Image
                      src={product.mainImage}
                      width={130}
                      height={130}
                      alt={product.name}
                    />
                  </div>
                  <div className="flex flex-col w-full justify-around">
                    <div className="flex w-full justify-between items-center mb-6">
                      <h2 className="font-mono font-bold text-black text-2xl">
                        {product.name}
                      </h2>
                      <button onClick={() => updateCartQuantity(product.id, 0)}>
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-black top-0 right-0"
                          size="xl"
                        />
                      </button>
                    </div>
                    <div className="mb-6">
                      <div className="p-2 border border-black w-20">
                        <h2 className="text-black">Hello</h2>
                      </div>
                      <div></div>
                      <div></div>
                    </div>
                    <div>
                      <div>
                        <h1 className="font-poppins font-bold text-black underline cursor-pointer">
                          MOVE TO FAVOURITES
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <FooterOne padLinesHide />
      <FooterTwo />
    </>
  );
};

export default sampleCart;
