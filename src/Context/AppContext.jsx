"use client";

import { useUser } from "@clerk/nextjs";
import { productsDummyData, userDummyData } from "../assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import UpdateCart from "../../models/UpdateCart";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [adminLoading, setAdminLoading] = useState(true);

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      console.log("Inside addToCART IF");
      cartData[itemId] += 1;
      console.log(cartData[itemId]);
    } else {
      console.log("Inside addToCART ELSE");
      cartData[itemId] = 1;
      console.log(cartData[itemId]);
    }
    setCartItems(cartData);

    if (user) {
      try {
        console.log(user.id);
        await UpdateCart({ userId: user.id, cartDataProp: cartData });
        toast.success("Product dded to cart");
      } catch (error) {
        toast.error("Failed to add product to cart");
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
      toast.success("Item Removed");
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
      try {
        console.log(user.id);
        await UpdateCart({ userId: user.id, cartDataProp: cartData });
        toast.success("Cart Updated");
      } catch (error) {
        toast.error("Failed to update cart");
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.price * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const value = {
    user,
    currency,
    router,
    isAdmin,
    setIsAdmin,
    adminLoading,
    setAdminLoading,
    userData,
    setUserData,
    products,
    setProducts,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
