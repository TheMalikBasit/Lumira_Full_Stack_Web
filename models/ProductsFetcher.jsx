"use client";

import { useAppContext } from "@/Context/AppContext";
import { db } from "../Config/firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProductsFetcher() {
  const { setProducts } = useAppContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(products);
        //console.log("Products fetched successfully:", products);
      } catch (error) {
        toast.error("Network Issue 🐒🐒");
      }
    };
    fetchProducts();
  }, [setProducts]);

  return null;
}
