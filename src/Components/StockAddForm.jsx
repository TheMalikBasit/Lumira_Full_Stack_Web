"use client";

import Button from "./Button";
import { useAppContext } from "../Context/AppContext";
import { useEffect, useState } from "react";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import UploadProduct from "../../models/StockUpdater";
const StockAddForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [imageUrl, setImageUrl] = useState([]); // Array of URLs
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // For input field
  const [availableStock, setAvailableStock] = useState("");
  const [description, setDescription] = useState("");
  const { products } = useAppContext();

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (currentImageUrl.trim() !== "") {
      setImageUrl((prev) => [...prev, currentImageUrl.trim()]);
      setCurrentImageUrl("");
    }
  };

  useEffect(() => {
    products;
  });

  const handleRemoveImageUrl = (idx) => {
    setImageUrl((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await UploadProduct({
      name,
      price: Number(price),
      mainImage,
      imageUrl, // Pass the array
      availableStock: Number(availableStock),
      description,
    });

    // Optional: clear fields
    setName("");
    setPrice("");
    setMainImage("");
    setImageUrl([]);
    setCurrentImageUrl("");
    setAvailableStock("");
    setDescription("");
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setMainImage("");
    setImageUrl([]);
    setCurrentImageUrl("");
    setAvailableStock("");
    setDescription("");
  };
  return (
    <div className="max-w-2xl lg:max-w-[45%] mt-12 sm:mx-auto md:mx-2 w-full px-4">
      <h2 className="text-3xl font-bold mb-6 text-white">Upload New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] p-6 rounded-xl shadow-lg border border-gray-700 space-y-5"
      >
        <div>
          <label className="text-sm text-gray-400">Product Name</label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Price</label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Main Image URL</label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="https://..."
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Sub Image URLs</label>
          <div className="flex gap-2 mt-1">
            <input
              className="flex-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={currentImageUrl}
              onChange={(e) => setCurrentImageUrl(e.target.value)}
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              OK
            </button>
          </div>
          {/* Show added URLs */}
          <ul className="mt-2 space-y-1">
            {imageUrl.map((url, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-gray-300"
              >
                <span>{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImageUrl(idx)}
                  className="text-red-400 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="text-sm text-gray-400">Available Stock</label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            value={availableStock}
            onChange={(e) => setAvailableStock(e.target.value)}
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows={3}
            required
          ></textarea>
        </div>

        <div className="flex flex-col xl:flex-row justify-between">
          <Button className="mt-5 xl:mt-0" type="submit">
            Upload Product
          </Button>
          <Button
            className="mt-5 xl:mt-0"
            type="button"
            white
            onclick={clearForm}
          >
            Clear Form
          </Button>
        </div>
        <ButtonGradient />
      </form>
    </div>
  );
};

export default StockAddForm;
