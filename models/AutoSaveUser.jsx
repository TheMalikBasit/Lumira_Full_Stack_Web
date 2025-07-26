"use client";

import { useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebase";
import { useUser } from "@clerk/nextjs";
import { useAppContext } from "@/Context/AppContext";
const AutoSaveUser = () => {
  const { isSignedIn, user } = useUser();
  const { setUserData, setCartItems, setLoading, setdarkMode } =
    useAppContext();

  useEffect(() => {
    const saveUserToFirestore = async () => {
      try {
        setLoading(true);

        if (!isSignedIn || !user) {
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", user.id);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          await setDoc(userRef, {
            id: user.id,
            username: user.fullName || "",
            email: user.primaryEmailAddress.emailAddress,
            imageUrl: user.imageUrl,
            address: [],
            ordersHistory: [],
            isAdmin: false,
            cart: [],
            darkMode: false,
          });
          setCartItems([]);
          console.log("User info stored in Firestore");
          setLoading(false);
        } else {
          const userData = userSnapshot.data();
          let cartData = Array.isArray(userData.cart) ? userData.cart : [];
          let userShippingInfo = Array.isArray(userData.ShippingInfo)
            ? userData.ShippingInfo
            : [];

          let mode = userData.darkMode;

          setdarkMode(mode);
          // Ensure each item has 'checked' field
          cartData = cartData.map((item) => ({
            ...item,
            checked: item.checked ?? false,
          }));

          setUserData({
            id: user.id,
            username: user.fullName || "",
            email: user.primaryEmailAddress.emailAddress,
            imageUrl: user.imageUrl,
            ShippingInfo: userShippingInfo,
          });

          setCartItems(cartData);
          console.log("Updated cart data: ", cartData);
          console.log("User userShippingInfo: ", userShippingInfo);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error saving user to Firestore:", error);
      }
    };

    saveUserToFirestore();
  }, [isSignedIn, user]);
};

export default AutoSaveUser;
