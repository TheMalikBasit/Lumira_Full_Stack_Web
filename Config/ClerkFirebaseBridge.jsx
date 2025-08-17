"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import app from "./firebase"; // your firebase.jsx default export
import toast from "react-hot-toast";

export default function ClerkFirebaseBridge() {
  const { getToken, userId } = useAuth();
  const firebaseAuth = getAuth(app);

  useEffect(() => {
    const syncFirebaseAuth = async () => {
      if (!userId) {
        //console.log("ℹ️ No Clerk user signed in. Skipping Firebase Auth sync.");
        return;
      }

      try {
        // Use the correct template name for the Firebase integration
        const token = await getToken({ template: "integration_firebase" });

        if (!token) {
          //console.log("ℹ️ Clerk returned no Firebase token.");
          return;
        }

        await signInWithCustomToken(firebaseAuth, token);

        // console.log("✅ Firebase Auth signed in successfully.");
        toast.success("Sign in success");
      } catch (err) {
        console.error("❌ Error signing in Firebase Auth:", err);
        toast.error("Authentication failed (Reload).");
      }
    };

    syncFirebaseAuth();
  }, [getToken, userId, firebaseAuth]);

  return null;
}
