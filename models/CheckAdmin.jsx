"use client";

import { db } from "../Config/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAppContext } from "../src/Context/AppContext";
import toast from "react-hot-toast";

export default function CheckAdmin() {
  const { setIsAdmin, setAdminLoading } = useAppContext();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setAdminLoading(true);

      if (!isSignedIn || !user) {
        setIsAdmin(false);
        setAdminLoading(false);
        //console.log("User is not signed in or user data is not available");
        return;
      }

      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().isAdmin) {
        setIsAdmin(true);
        toast.success("Welcome Admin");
      } else {
        setIsAdmin(false);
      }
      setAdminLoading(false);
    };

    checkAdminStatus();
  }, [isSignedIn, user, setIsAdmin, setAdminLoading]);

  return null;
}
