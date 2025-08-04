import { doc, setDoc } from "firebase/firestore";
import { db } from "../Config/firebase";

//const CURRENCIES = ["AED", "EUR", "JPY", "CNY", "PKR", "CAD"];
const API_KEY_OPEN = "7b557668cab64732ac845af4cc3aa221";

//const API_KEY_EXCHANGE_RATES = "ce4880bb6793e555fe842f37461cec43";
//const apiExchangeRates = `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY_EXCHANGE_RATES}&symbols=AED,USD,JPY,CNY,PKR,CAD`;

export const updateExchangeRates = async () => {
  try {
    const res = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${API_KEY_OPEN}&base=USD`
    );
    const data = await res.json();

    if (!data.rates) throw new Error("Failed to fetch exchange rates");

    const usdToRates = data.rates;
    const timestamp = new Date();

    // Save to Firestore
    await setDoc(doc(db, "rates", "latest"), {
      base: "USD",
      rates: usdToRates,
      updatedAt: timestamp,
    });

    return { success: true, rates: usdToRates, timestamp };
  } catch (error) {
    console.error("Rate Update Error:", error);
    return { success: false, error };
  }
};
