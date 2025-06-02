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
      try {
        if (!isSignedIn || !user) return;

        setUserData({
          id: user.id,
          username: user.fullName || "",
          email: user.primaryEmailAddress.emailAddress,
          imageUrl: user.imageUrl,
        });

        const userRef = doc(db, "users", user.id);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          await setDoc(userRef, {
            id: user.id,
            username: user.fullName || "",
            email: user.primaryEmailAddress.emailAddress,
            imageUrl: user.imageUrl,
            address: "",
            orders: [],
            isAdmin: false,
            cart: [],
          });
          setCartItems([]);
          console.log("User info stored in Firestore");
        } else {
          const userData = userSnapshot.data();
          let cartData = Array.isArray(userData.cart) ? userData.cart : [];

          // Ensure each item has 'checked' field
          cartData = cartData.map((item) => ({
            ...item,
            checked: item.checked ?? false,
          }));

          setCartItems(cartData);
          console.log("Updated cart data: ", cartData);
        }
      } catch (error) {
        console.error("Error saving user to Firestore:", error);
      }
    };

    saveUserToFirestore();
  }, [isSignedIn, user]);

  return null;
};

export default AutoSaveUser;
