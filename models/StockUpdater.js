// "use client";
// import { db } from "../Config/firebase";
// import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
// import { useAppContext } from "@/Context/AppContext";
// import toast from "react-hot-toast";
// const UploadProduct = async ({
//   name,
//   price,
//   originalPrice,
//   rating,
//   reviews,
//   badges,
//   features,
//   mainImage,
//   imageUrl,
//   availableStock,
//   category,
//   description,
// }) => {
//   try {
//     await addDoc(collection(db, "products"), {
//       name,
//       price,
//       originalPrice,
//       mainImage,
//       imageUrl,
//       availableStock,
//       description,
//       rating,
//       reviews,
//       badges,
//       features,
//       category,
//       createdAt: new Date(),
//     });

//     toast.success("Product uploaded successfully!");
//   } catch (error) {
//     console.error("Upload failed:", error);
//     toast.error("Failed to upload product.");
//   }
// };

// export default UploadProduct;

"use client";

import { db } from "../Config/firebase";
import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

/**
 * Uploads a product to Firestore with optional CJ variants.
 * - Stores main product data in /products
 * - Stores variants in /products/{productId}/variants
 */
const UploadProduct = async ({
  name,
  price,
  originalPrice,
  cjProductId,
  cjPrice,
  mainImage,
  imageUrl,
  availableStock,
  description,
  rating,
  reviews,
  badges,
  features,
  category,
  cjVariants = [], // Default to empty array
}) => {
  try {
    // Add main product document
    const productRef = await addDoc(collection(db, "products"), {
      name,
      price,
      originalPrice,
      cjProductId: cjProductId || null,
      cjPrice: cjPrice || null,
      mainImage,
      imageUrl,
      availableStock,
      description,
      rating,
      reviews,
      badges,
      features,
      category,
      createdAt: serverTimestamp(),
    });

    // If variants exist, create subcollection
    if (Array.isArray(cjVariants) && cjVariants.length > 0) {
      const variantsCollectionRef = collection(productRef, "variants");

      for (const variant of cjVariants) {
        await addDoc(variantsCollectionRef, {
          vid: variant.vid || null,
          pid: variant.pid || null,
          cjName: variant.variantNameEn || "",
          cjPrice: Number(variant.variantSellPrice) || 0,
          lumiraPrice: Number(variant.lumiraPrice) || 0, // your entered price
          cjImage: variant.variantImage || "",
          cjSku: variant.variantSku || "",
          cjKey: variant.variantKey || "",
          cjWeight: variant.variantWeight || null,
          cjLength: variant.variantLength || null,
          cjWidth: variant.variantWidth || null,
          cjHeight: variant.variantHeight || null,
          cjVolume: variant.variantVolume || null,
          cjSugSellPrice: variant.variantSugSellPrice || null,
          originalPrice: Number(variant.originalPrice) || 0,
          createdAt: new Date(),
        });
      }
    }

    toast.success("Product uploaded successfully!");
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error("Failed to upload product.");
  }
};

export default UploadProduct;
