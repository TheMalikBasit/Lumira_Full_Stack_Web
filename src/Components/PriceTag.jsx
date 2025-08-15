"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
export default function PriceTag({ basePrice, userCurrency, symbol }) {
  const [convertedPrice, setConvertedPrice] = useState(null);
  const { CurrencyRates, loading } = useAppContext();
  // console.log("Currency Data from Price tag: ", CurrencyRates);

  useEffect(() => {
    try {
      if (CurrencyRates) {
        const ratesData = CurrencyRates.rates;
        const rate = ratesData[userCurrency];
        console.log("rates : ", rate);
        if (!rate) {
          toast.error(`No rate found for currency: ${userCurrency}`);
          return;
        }
        const converted = (basePrice * rate).toFixed(2);
        setConvertedPrice(converted);
      } else {
        setConvertedPrice("6969");
        toast.error("This MF");
      }
    } catch (err) {
      setConvertedPrice("6969");
    }
  });

  if (loading) return `Converting price...`;
  return (
    <div>
      <h1>
        {convertedPrice ? (
          <>
            {convertedPrice} {symbol}
          </>
        ) : (
          <>
            <div className=" bg-n-background flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-4 text-n-foreground" />
            </div>
          </>
        )}
      </h1>
    </div>
  );
}
