"use client";
import { db } from "../Config/firebase";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { useAppContext } from "@/Context/AppContext";
import toast from "react-hot-toast";
const UploadProduct = async ({
  name,
  price,
  originalPrice,
  rating,
  reviews,
  badges,
  features,
  mainImage,
  imageUrl,
  availableStock,
  category,
  description,
}) => {
  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      originalPrice,
      mainImage,
      imageUrl,
      availableStock,
      description,
      rating,
      reviews,
      badges,
      features,
      category,
      createdAt: new Date(),
    });

    toast.success("Product uploaded successfully!");
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error("Failed to upload product.");
  }
};

export default UploadProduct;
