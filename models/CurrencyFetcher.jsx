"use client";

import { useAppContext } from "@/Context/AppContext";
import { db } from "../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function CurrencyFetcher() {
  const { setCurrencyRates, setLoading } = useAppContext();

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        setLoading(true);

        const currencySnapShot = await getDoc(doc(db, "rates", "latest"));

        if (!currencySnapShot.exists()) {
          setLoading(false);
          throw new Error("No currency data found");
        }

        const currencyData = currencySnapShot.data();

        setCurrencyRates(currencyData);
        setLoading(false);
        // console.log("Fetched Currency Rates ✅", currencyData);
      } catch (error) {
        console.error("Currency Fetch Error:", error);
        toast.error("Network Issue 🐒🐒");
        setLoading(false);
      }
    };

    fetchCurrency();
  }, [setCurrencyRates]);

  return null;
}
