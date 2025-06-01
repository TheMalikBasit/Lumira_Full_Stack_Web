"use client";
import { db } from "../Config/firebase";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
const UpdateProduct = async ({
  id,
  name,
  price,
  mainImage,
  imageUrl,
  availableStock,
  description,
}) => {
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      await updateDoc(productRef, {
        id,
        name,
        price,
        mainImage,
        imageUrl,
        availableStock,
        description,
        updatedAt: new Date(),
      });
      toast.success("Product updated successfully!");
    } else {
      toast.error("Product not found! Try adding this product.");
    }
  } catch (error) {
    toast.error("Failed to update product.");
  }
};

export default UpdateProduct;
