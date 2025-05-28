"use client";
import { db } from "../Config/firebase";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";

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
      alert("✅ Product updated successfully!");
    } else {
      alert("Product not found! Try adding this product.");
    }
  } catch (error) {
    alert("Failed to update product.");
  }
};

export default UpdateProduct;
