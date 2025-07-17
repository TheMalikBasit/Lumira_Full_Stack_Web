"use client";
import { db } from "../Config/firebase";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { useAppContext } from "@/Context/AppContext";
import toast from "react-hot-toast";
const UploadProduct = async ({
  name,
  price,
  mainImage,
  imageUrl,
  availableStock,
  description,
}) => {
  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      mainImage,
      imageUrl,
      availableStock,
      description,
      createdAt: new Date(),
    });

    toast.success("Product uploaded successfully!");
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error("Failed to upload product.");
  }
};

export default UploadProduct;
