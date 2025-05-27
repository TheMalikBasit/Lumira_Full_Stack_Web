"use client";

import { db } from "../Config/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAppContext } from "../src/Context/AppContext";

export default function CheckAdmin() {
  const { setIsSeller } = useAppContext();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isSignedIn || !user) {
        setIsSeller(false);
        console.log("User is not signed in or user data is not available");
        return;
      }

      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().isAdmin) {
        setIsSeller(true);
        console.log("User is an admin");
      } else {
        setIsSeller(false);
        console.log("User is not an admin");
      }
    };

    checkAdminStatus();
  }, [isSignedIn, user, setIsSeller]);

  return null;
}
