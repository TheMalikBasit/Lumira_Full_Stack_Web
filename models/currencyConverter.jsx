import toast from "react-hot-toast";

export const currencyConverter = async (amount, from, to) => {
  try {
    if (from.toUpperCase() === to.toUpperCase()) return amount;

    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from.toUpperCase()}&to=${to.toUpperCase()}`
    );

    const data = await res.json();

    const rate = data.rates?.[to.toUpperCase()];
    if (rate === undefined) {
      toast.error(`Rate for ${to} not found in response`);
    }

    return rate;
  } catch (error) {
    console.error("Currency conversion failed:", error.message);
    return null;
  }
};
