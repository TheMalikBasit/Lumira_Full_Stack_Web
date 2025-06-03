import { useAppContext } from "@/Context/AppContext";
import { useState, useEffect } from "react";
const OrderSummaryClassic = () => {
  const { getCartAmount, currency } = useAppContext();
  const [shipmentCharges, setshipmentCharges] = useState(0);

  useEffect(() => {
    if (getCartAmount() > 0) {
      setshipmentCharges(200);
    } else {
      setshipmentCharges(0);
    }
  }, [getCartAmount]);

  return (
    <div className="border border-black p-5 min-w-[20rem] xl:w-[30rem]">
      <h1 className="text-black font-sans text-lg font-bold">ORDER SUMMARY</h1>
      <div className="flex flex-col items-start w-full mt-5">
        <div className="flex flex-row w-full justify-between">
          <h2 className="text-gray-600 text-sm">SUBTOTAL</h2>
          <h2 className="text-black text-sm font-bold">
            {currency} <span> </span> {getCartAmount()}
          </h2>
        </div>
        <div className="flex flex-row w-full justify-between mt-3">
          <h2 className="text-gray-600 text-sm">
            TAX <span className="text-orange-500">2%</span>
          </h2>
          <h2 className="text-black text-sm font-bold">
            {currency} <span> </span>
            {Math.floor(getCartAmount() * 0.02)}
          </h2>
        </div>
        <div className="flex flex-row w-full justify-between mt-3">
          <h2 className="text-gray-600 text-sm">SHIPMENT CHARGES</h2>
          <h2 className="text-black text-sm font-bold">
            {currency} <span> </span> {shipmentCharges}
          </h2>
        </div>
        <div className="flex flex-row w-full justify-between mt-3">
          <h2 className="text-gray-600 text-sm">SUBTOTAL</h2>
          <h2 className="text-black text-sm font-bold">
            {currency} <span> </span>
            {getCartAmount() +
              Math.floor(getCartAmount() * 0.02) +
              shipmentCharges}
          </h2>
        </div>
      </div>
      <button className="bg-neutral-800 text-neutral-50 w-full p-4 mt-5">
        CHECKOUT
      </button>
    </div>
  );
};

export default OrderSummaryClassic;
