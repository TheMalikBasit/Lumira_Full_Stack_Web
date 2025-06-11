"use client";
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "../../Context/AppContext";

const sampleCart = () => {
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
  } = useAppContext();

  return (
    <>
      <Navbar relative />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {getCartCount()} Items
            </p>
          </div>
          <div className="overflow-x-auto">
            {cartItems?.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead className="text-left">
                  <tr>
                    <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-400 font-medium">
                      Product Details
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-400 font-medium">
                      Price
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-400 font-medium">
                      Quantity
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-400 font-medium">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const product = products.find(
                      (product) => product.id === item.itemId
                    );

                    if (!product) return null;

                    return (
                      <tr key={item.itemId}>
                        <td className="py-4 md:px-4">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => {
                              toggleItemChecked(item.itemId);
                            }}
                          />
                        </td>
                        <td className="py-4 md:px-4">{product.name}</td>
                        <td className="py-4 md:px-4">${product.price}</td>
                        <td className="py-4 md:px-4">
                          <button
                            disabled={item.quantity <= 1} // Prevent going below 1
                            onClick={() =>
                              updateCartQuantity(item.itemId, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          {item.quantity}
                          <button
                            onClick={() =>
                              updateCartQuantity(item.itemId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </td>
                        <td className="py-4 md:px-4">
                          ${(product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 md:px-4">
                          <button
                            onClick={() => removeItemFromCart(item.itemId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
          </div>
          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-6 gap-2 text-orange-600"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
      <div></div>
    </>
  );
};

export default sampleCart;
