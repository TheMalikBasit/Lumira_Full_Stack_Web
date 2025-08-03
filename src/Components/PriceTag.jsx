// "use client";
// import { useEffect, useState } from "react";
// import { currencyConverter } from "../../models/currencyConverter";

// export default function PriceTag({ priceUSD, userCurrency, symbol }) {
//   const [convertedPrice, setConvertedPrice] = useState(null);

//   useEffect(() => {
//     const fetchConversion = async () => {
//       const result = await currencyConverter(priceUSD, "USD", userCurrency);
//       setConvertedPrice(result);
//     };
//     fetchConversion();
//   }, [priceUSD, userCurrency]);

//   return (
//     <div>
//       <h1>
//         {convertedPrice ? (
//           <>
//             {convertedPrice} {symbol}
//           </>
//         ) : (
//           <p className="text-sm">Converting price...</p>
//         )}
//       </h1>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
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
          `Converting price...`
        )}
      </h1>
    </div>
  );
}
