"use client";

import { Loading, LottieLoading } from "@/Components/Loading";
import Navbar from "@/Components/Navbar";
import { useAppContext } from "@/Context/AppContext";
import Image from "next/image";
import StockAddForm from "@/Components/StockAddForm";
import StockUpdateForm from "@/Components/StockUpdateForm";
import { useState } from "react";
import Button from "@/Components/Button";
import { updateExchangeRates } from "../../../models/updateExchangeRates";
import { db } from "../../../Config/firebase";
import { addDoc, collection } from "firebase/firestore";
const page = () => {
  const { isAdmin, adminLoading } = useAppContext();
  const [status, setStatus] = useState(null);
  const { products } = useAppContext();
  const [id, setId] = useState("");

  const handleUpdateForm = (id) => {
    setId(id);
    //console.log("Selected product ID:", id);
  };

  const handleUpdate = async () => {
    setStatus("Updating...");
    const result = await updateExchangeRates();
    if (result.success) {
      setStatus(
        `✅ Rates updated at ${new Date(result.timestamp).toLocaleString()}`
      );
    } else {
      setStatus("❌ Failed to update rates.");
    }
  };

  if (adminLoading) return <LottieLoading />;

  if (!isAdmin) {
    return (
      <div>
        <Navbar relative />
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar bgBlur />
      <div className="px-4 py-5 mt-20">
        <div className="text-center mt-10">
          <h1 className="text-orange-500 text-2xl font-bold ">
            Welcome to admin dashboard
          </h1>
        </div>
        <div className="container w-full border-t border-gray-700 my-8" />
        <div className="flex flex-col my-5">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Update Rates
          </button>
          {status && <p className="mt-4 text-gray-800">{status}</p>}
        </div>
        <div className="flex flex-col lg:justify-around lg:flex-row justify-start">
          <StockAddForm />
          <StockUpdateForm id={id} />
        </div>
        <div className="max-w-2xl xl:max-w-[45%] mx-auto xl:mx-0 xl:ml-11 mt-12 lg:max-w-full px-4">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">
            All Products
          </h2>
          <div className="rounded-xl border border-gray-700 overflow-y-auto max-h-[44.4rem] bg-[#111827]">
            <div className="bg-[#111827] p-6 shadow-lg  space-y-5 flex flex-col">
              {Array.isArray(products) &&
                products.map((item, index) => (
                  <div
                    className="flex flex-row items-center"
                    key={index}
                    onClick={() => {
                      handleUpdateForm(item.id);
                      scrollTo(0, 0);
                    }}
                  >
                    <h1 className="text-lg font-bold text-orange-600 pr-2">
                      {index + 1}
                    </h1>
                    <div className="w-full rounded-xl border border-gray-700 p-4 shadow-lg flex flex-row items-center cursor-pointer">
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                      />
                      <div className="ml-4 overflow-hidden flex flex-row items-baseline lg:items-center xl:items-baseline justify-between w-full">
                        <div className="flex flex-col items-center w-full">
                          <h2 className="font-bold text-orange-600">
                            Product Name
                          </h2>
                          <h2>{item.name}</h2>
                        </div>
                        <div className="flex flex-row  w-full">
                          <div className="hidden md:flex flex-col items-center mr-20">
                            <h2 className="font-bold text-orange-600">Price</h2>
                            <h3>{item.price}</h3>
                          </div>
                          <div className="flex flex-col items-center">
                            <h2 className="font-bold text-orange-600">
                              Current Stock
                            </h2>
                            <h3>{item.availableStock}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="container w-full border-t border-gray-700 mt-8 mb-8" />
      </div>
    </>
  );
};

export default page;
