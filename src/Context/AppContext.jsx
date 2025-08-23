"use client";

import { useUser } from "@clerk/nextjs";
import { productsDummyData, userDummyData } from "../assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import UpdateCart from "../../models/UpdateCart";
import toast from "react-hot-toast";
import {
  fetchLocalCart,
  addLocalProducts,
  removeLocalProducts,
  deleteLocalProducts,
  clearLocalCart,
} from "../../models/OfflineModules";
export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  // const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user, isSignedIn } = useUser();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [localCart, setLocalCart] = useState(fetchLocalCart());
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [darkMode, setdarkMode] = useState(false);
  const [orderHistory, setorderHistory] = useState([]);
  const [Currency, setCurrency] = useState("");
  const [Symbol, setSymbol] = useState("");
  const [CurrencyRates, setCurrencyRates] = useState({});
  //console.log("Curency from App Context", Currency);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedCurrency");
      const symbol = localStorage.getItem("selectedSymbol");
      if (stored) {
        setCurrency(stored);
        setSymbol(symbol);
        //console.log("Currency from localStorage:", stored);
      } else {
        setCurrency("USD");
        setSymbol("$");
      }
    }
  }); // empty dependency array: runs ONCE on initial mount

  // console.log("CurrencyRates from app context", CurrencyRates);
  // const ratesData = CurrencyRates.rates;
  // console.log("rates : ", ratesData);
  const addToCart = async (id, variantId) => {
    let cartData = structuredClone(cartItems);

    let itemIndex = cartData.findIndex((item) => item.variantId === variantId);
    if (itemIndex !== -1) {
      cartData[itemIndex].quantity += 1;
    } else {
      cartData.push({ id: id, vid: variantId, quantity: 1, checked: true });
    }

    setCartItems(cartData);

    if (user) {
      try {
        await UpdateCart({ userId: user.id, cartDataProp: cartData });
        toast.success("Product added to cart");
      } catch (error) {
        toast.error("Failed to add product to cart");
      }
    }
  };

  const updateCartQuantity = async (variantId, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      cartData = cartData.filter((item) => item.vid !== variantId);
    } else {
      cartData = cartData.map((item) =>
        item.vid === variantId ? { ...item, quantity } : item
      );
    }

    setCartItems(cartData);

    if (user) {
      try {
        await UpdateCart({ userId: user.id, cartDataProp: cartData });
        toast.success("Cart Updated");
      } catch (error) {
        toast.error("Failed to update cart");
      }
    }
  };

  const toggleItemChecked = async (variantId, id) => {
    let cartData = structuredClone(cartItems);

    cartData = cartData.map((item) =>
      item.vid === variantId
        ? {
            ...item,
            checked:
              products.find((p) => p.id === item.id)?.availableStock > 0
                ? !item.checked
                : false,
          }
        : item
    );

    setCartItems(cartData);

    if (user) {
      try {
        await UpdateCart({ userId: user.id, cartDataProp: cartData });
        products.find((p) => p.id === id).availableStock > 0
          ? toast.success("Cart Updated")
          : toast.error("Item out of stock");
      } catch (error) {
        toast.error("Failed to update cart");
      }
    }
  };

  const removeItemFromCart = async (variantId) => {
    let cartData = cartItems.filter((item) => item.vid !== variantId);

    setCartItems(cartData);

    if (user) {
      try {
        await UpdateCart({ userId: user.id, cartDataProp: cartData });
        toast.success("Cart Updated");
      } catch (error) {
        toast.error("Failed to update cart");
      }
    }
  };

  const getCartCount = () => {
    return cartItems
      .filter((item) => item.checked)
      .reduce((count, item) => count + item.quantity, 0);
  };

  const getCartAmount = () => {
    return cartItems
      .filter((item) => item.checked)
      .reduce((total, item) => {
        let product = products.find((product) => product.id === item.id);
        return total + product.price * item.quantity;
      }, 0);
  };

  useEffect(() => {
    const syncCart = () => setLocalCart(fetchLocalCart());
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, [products, user]);

  const addToLocalCart = (id, variantId) => {
    addLocalProducts({ ID: id, variantId: variantId });
    setLocalCart(fetchLocalCart());
  };

  const removeFromLocalCart = (variantId) => {
    removeLocalProducts({ variantId: variantId });
    setLocalCart(fetchLocalCart());
  };

  const deleteFromLocalCart = (variantId) => {
    deleteLocalProducts({ variantId: variantId });
    setLocalCart(fetchLocalCart());
  };

  const clearLocalCartData = () => {
    clearLocalCart();
    setLocalCart([]);
  };

  const toggleLocalItemCheck = (variantId) => {
    const updatedCart = localCart.map((item) =>
      item.vid === variantId
        ? {
            ...item,
            checked:
              products.find((p) => p.id === item.id)?.availableStock > 0
                ? !item.checked
                : false,
          }
        : item
    );
    setLocalCart(updatedCart);

    localStorage.setItem("local_cart", JSON.stringify(updatedCart)); // <-- persist changes
    toast.success("Cart updated");
  };

  const getLocalCartAmount = () => {
    return localCart
      .filter((item) => item.checked)
      .reduce((total, item) => {
        let product = products.find((product) => product.id === item.id);
        if (!product) return total; // <-- skip if product not found
        return total + product.price * item.quantity;
      }, 0);
  };
  const value = {
    user,
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
    toggleItemChecked,
    removeItemFromCart,
    setLoading,
    loading,
    setdarkMode,
    darkMode,
    localCart,
    setLocalCart,
    addToLocalCart,
    removeFromLocalCart,
    clearLocalCartData,
    deleteFromLocalCart,
    toggleLocalItemCheck,
    getLocalCartAmount,
    Currency,
    setCurrency,
    Symbol,
    setSymbol,
    CurrencyRates,
    setCurrencyRates,
    orderHistory,
    setorderHistory,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
