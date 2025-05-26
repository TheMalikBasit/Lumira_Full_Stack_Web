"use client";

import { useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebase";
import { useUser } from "@clerk/nextjs";

const AutoSaveUser = () => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const saveUserToFirestore = async () => {
      if (!isSignedIn || !user) return;

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
        });
        console.log("User info stored in Firestore");
      } else {
        console.log("User already exists in Firestore");
      }
    };

    saveUserToFirestore();
  }, [isSignedIn, user]);

  return null; // This component does not render anything
};

export default AutoSaveUser;
