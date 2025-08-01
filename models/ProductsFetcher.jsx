"use client";

import { useAppContext } from "@/Context/AppContext";
import { db } from "../Config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";

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
        alert("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, [setProducts]);

  return null;
}
