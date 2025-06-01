"use client";

import { useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebase";
import { useUser } from "@clerk/nextjs";
import { useAppContext } from "@/Context/AppContext";
const AutoSaveUser = () => {
  const { isSignedIn, user } = useUser();
  const { setUserData, setCartItems } = useAppContext();

  useEffect(() => {
    const saveUserToFirestore = async () => {
      if (!isSignedIn || !user) return;

      if (isSignedIn && user) {
        setUserData({
          id: user.id,
          username: user.fullName || "",
          email: user.primaryEmailAddress.emailAddress,
          imageUrl: user.imageUrl,
        });
        console.log("User data set in context...");
      }
      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          id: user.id,
          username: user.fullName || "",
          email: user.primaryEmailAddress.emailAddress,
          imageUrl: user.imageUrl,
          address: "", // Placeholder (can be updated later)
          orders: [], // Start with empty order list
          isAdmin: false,
          cart: {},
        });
        setCartItems({});
        console.log("User info stored in Firestore");
      } else {
        const userData = userSnapshot.data();
        const cartData = userData.cart || [];
        setCartItems(cartData);
        console.log("From auto save user: ", cartData);
        console.log("User already exists in Firestore");
      }
    };
    saveUserToFirestore();
  }, [isSignedIn, user]);

  return null;
};

export default AutoSaveUser;
