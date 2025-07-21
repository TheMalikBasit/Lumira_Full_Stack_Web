import { useAppContext } from "@/Context/AppContext";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
const OrderSummaryClassic = () => {
  const { getCartAmount, currency, darkMode, getLocalCartAmount, products } =
    useAppContext();
  const [shipmentCharges, setshipmentCharges] = useState(0);
  const { isSignedIn } = useUser();
  useEffect(() => {
    if (getCartAmount() > 0 || getLocalCartAmount() > 0) {
      setshipmentCharges(200);
    } else {
      setshipmentCharges(0);
    }
  }, [getCartAmount, getLocalCartAmount, products]);

  return (
    <div
      className={`border ${
        darkMode ? "border-white" : "border-black"
      } p-5 min-w-[20rem] xl:w-[30rem]`}
    >
      <h1
        className={`font-sans text-lg font-bold ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        ORDER SUMMARY
      </h1>
      <div className="flex flex-col items-start w-full mt-5">
        <div className="flex flex-row w-full justify-between">
          <h2 className="text-gray-600 text-sm">SUBTOTAL</h2>
          <h2
            className={`${
              darkMode ? "text-white" : "text-black"
            } text-sm font-bold`}
          >
            {currency} <span> </span>{" "}
            {isSignedIn ? getCartAmount() : getLocalCartAmount()}
          </h2>
        </div>
        <div className="flex flex-row w-full justify-between mt-3">
          <h2 className="text-gray-600 text-sm">
            TAX <span className="text-orange-500">2%</span>
          </h2>
          <h2
            className={`${
              darkMode ? "text-white" : "text-black"
            } text-sm font-bold`}
          >
            {currency} <span> </span>
            {Math.floor(
              isSignedIn ? getCartAmount() * 0.02 : getLocalCartAmount() * 0.02
            )}
          </h2>
        </div>
        <div className="flex flex-row w-full justify-between mt-3">
          <h2 className="text-gray-600 text-sm">SHIPMENT CHARGES</h2>
          <h2
            className={`${
              darkMode ? "text-white" : "text-black"
            } text-sm font-bold`}
          >
            {currency} <span> </span> {shipmentCharges}
          </h2>
        </div>
        <div className="flex flex-row w-full justify-between mt-3">
          <h2 className="text-gray-600 text-sm">SUBTOTAL</h2>
          <h2
            className={`${
              darkMode ? "text-white" : "text-black"
            } text-sm font-bold`}
          >
            {currency} <span> </span>
            {isSignedIn
              ? getCartAmount() +
                Math.floor(getCartAmount() * 0.02) +
                shipmentCharges
              : getLocalCartAmount() +
                Math.floor(getLocalCartAmount() * 0.02) +
                shipmentCharges}
          </h2>
        </div>
      </div>
      <button
        className={`${
          darkMode ? "bg-white text-black" : "bg-neutral-800 text-neutral-50"
        } w-full p-4 mt-5`}
      >
        CHECKOUT
      </button>
    </div>
  );
};

export default OrderSummaryClassic;
