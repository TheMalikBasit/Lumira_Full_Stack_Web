"use client";
import { db } from "../Config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

/**
 * Updates product & its variants in Firestore
 * @param {Object} productData
 */
const UpdateProduct = async ({
  id,
  name,
  price,
  mainImage,
  imageUrl,
  availableStock,
  description,
  originalPrice,
  rating,
  reviews,
  badges,
  features,
  category,
  cjProductId,
  cjPrice,
  cjVariants = [], // new variants array from form
}) => {
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      toast.error("Product not found!");
      return;
    }

    // ✅ Update product doc
    await updateDoc(productRef, {
      name,
      price,
      mainImage,
      imageUrl,
      availableStock,
      description,
      originalPrice,
      rating,
      reviews,
      badges,
      features,
      category,
      cjProductId: cjProductId || null,
      cjPrice: cjPrice || null,
      updatedAt: new Date(),
    });

    // ✅ Handle variants subcollection
    const variantsRef = collection(productRef, "variants");
    const existingSnap = await getDocs(query(variantsRef));

    // Map existing variants { vid: docId }
    const existingVariants = {};
    existingSnap.forEach((d) => {
      existingVariants[d.data().vid] = d.id;
    });

    // Track vids that are still valid
    const seenVids = new Set();

    for (const variant of cjVariants) {
      const variantData = {
        vid: variant.vid || null,
        pid: variant.pid || null,
        cjName: variant.cjName || variant.variantNameEn || "",
        cjPrice: Number(variant.cjPrice || variant.variantSellPrice) || 0,
        lumiraPrice: Number(variant.lumiraPrice) || 0,
        cjImage: variant.cjImage || variant.variantImage || "",
        cjSku: variant.cjSku || variant.variantSku || "",
        cjKey: variant.cjKey || variant.variantKey || "",
        cjWeight: variant.cjWeight || variant.variantWeight || null,
        cjLength: variant.cjLength || variant.variantLength || null,
        cjWidth: variant.cjWidth || variant.variantWidth || null,
        cjHeight: variant.cjHeight || variant.variantHeight || null,
        cjVolume: variant.cjVolume || variant.variantVolume || null,
        cjSugSellPrice: variant.cjSugSellPrice || null,
        originalPrice: Number(variant.originalPrice) || 0,
        updatedAt: new Date(),
      };

      if (variant.vid && existingVariants[variant.vid]) {
        // ✅ Update existing
        const vRef = doc(variantsRef, existingVariants[variant.vid]);
        await updateDoc(vRef, variantData);
      } else {
        // ✅ Add new
        await addDoc(variantsRef, { ...variantData, createdAt: new Date() });
      }

      if (variant.vid) seenVids.add(variant.vid);
    }

    // ✅ Remove deleted variants
    for (const [vid, docId] of Object.entries(existingVariants)) {
      if (!seenVids.has(vid)) {
        await deleteDoc(doc(variantsRef, docId));
      }
    }

    toast.success("Product updated successfully!");
  } catch (error) {
    console.error("Update failed:", error);
    toast.error("Failed to update product.");
  }
};

export default UpdateProduct;
