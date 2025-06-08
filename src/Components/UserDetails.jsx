"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../Config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

const UserDetails = () => {
  const { userData } = useAppContext();
  const { user, isSignedIn } = useUser();
  const [Address, setAddress] = useState();

  console.log("user data from app context", userData.address);
  console.log("user data from clerk", user);

  const allAddress = userData.address;
  useEffect(() => {
    const updateAddress = async () => {
      try {
        if (!user) return;

        const userRef = doc(db, "users", user.id);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists() && isSignedIn) {
          await updateDoc(userRef, {
            address: Address,
          });
        }
        toast.success("Address updated successfully");
      } catch (error) {
        toast.error("Failed to add address");
      }
    };
  }, [Address]);
  return (
    <div className="border border-black p-5">
      <div>
        {Array.isArray(allAddress) &&
          allAddress.map((item, idx) => <div key={idx}>{item.City}</div>)}
      </div>
    </div>
  );
};

export default UserDetails;
