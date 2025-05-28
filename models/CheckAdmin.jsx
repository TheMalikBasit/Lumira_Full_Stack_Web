"use client";

import { db } from "../Config/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAppContext } from "../src/Context/AppContext";

export default function CheckAdmin() {
  const { setIsAdmin, setAdminLoading } = useAppContext();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setAdminLoading(true);

      if (!isSignedIn || !user) {
        setIsAdmin(false);
        setAdminLoading(false);
        console.log("User is not signed in or user data is not available");
        return;
      }

      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().isAdmin) {
        setIsAdmin(true);
        console.log("User is an admin");
      } else {
        setIsAdmin(false);
        console.log("User is not an admin");
      }
      setAdminLoading(false);
    };

    checkAdminStatus();
  }, [isSignedIn, user, setIsAdmin, setAdminLoading]);

  return null;
}
