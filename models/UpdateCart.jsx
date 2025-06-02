"use client";
import { db } from "../Config/firebase";
import { doc, updateDoc } from "firebase/firestore";

const UpdateCart = async ({ userId, cartDataProp }) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      cart: cartDataProp,
    });
  } catch (error) {
    console.log("Failed to add product in cart");
    console.error(error);
  }
};

export default UpdateCart;
