"use client";
import { db } from "../Config/firebase";
import { collection, addDoc } from "firebase/firestore";

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

    alert("✅ Product uploaded successfully!");
  } catch (error) {
    console.error("❌ Upload failed:", error);
    alert("Failed to upload product.");
  }
};

export default UploadProduct;
