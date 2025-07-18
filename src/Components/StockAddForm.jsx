"use client";

import Button from "./Button";
import { useAppContext } from "../Context/AppContext";
import { useEffect, useState } from "react";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import UploadProduct from "../../models/StockUpdater";

// Sanitize full Google Drive links
const sanitizeImageUrl = (url) => {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)\/view/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  const shareMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (shareMatch && shareMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${shareMatch[1]}`;
  }

  return url;
};

// Format Drive ID or sanitize full link
const formatMainImage = (url) => {
  const isDriveIdOnly = /^[a-zA-Z0-9_-]{25,}$/.test(url);
  if (isDriveIdOnly) {
    return `https://drive.google.com/uc?export=view&id=${url}`;
  }
  return sanitizeImageUrl(url);
};

const StockAddForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [availableStock, setAvailableStock] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState("");
  const [badges, setBadges] = useState("");
  const [features, setFeatures] = useState([]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const { products } = useAppContext();

  useEffect(() => {
    products;
  });

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (currentImageUrl.trim() !== "") {
      const sanitized = sanitizeImageUrl(currentImageUrl.trim());
      setImageUrl((prev) => [...prev, sanitized]);
      setCurrentImageUrl("");
    }
  };

  const handleRemoveImageUrl = (idx) => {
    setImageUrl((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await UploadProduct({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      mainImage: formatMainImage(mainImage),
      imageUrl: imageUrl.map(sanitizeImageUrl),
      availableStock: Number(availableStock),
      description,
      rating: rating ? Number(rating) : null,
      reviews: reviews ? Number(reviews) : null,
      badges,
      features,
      category,
    });

    clearForm();
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setOriginalPrice("");
    setMainImage("");
    setImageUrl([]);
    setCurrentImageUrl("");
    setAvailableStock("");
    setDescription("");
    setRating("");
    setReviews("");
    setBadges("");
    setFeatures([]);
    setCategory("");
  };

  return (
    <div className="max-w-2xl lg:max-w-[45%] mt-12 sm:mx-auto md:mx-2 w-full px-4">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Upload New Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] p-6 rounded-xl shadow-lg border border-gray-700 space-y-5"
      >
        <div className="flex flex-row gap-4 w-full">
          <div className="w-full">
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
          <div className="w-full">
            <label className="text-sm text-gray-400">Product Category</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              required
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full">
          <div className="w-full">
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
          <div className="w-full">
            <label className="text-sm text-gray-400">Original Price</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter original price"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">
            Main Image URL or Drive ID
          </label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="Drive ID or full image URL"
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
              placeholder="Drive link or image URL"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              OK
            </button>
          </div>
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
        <div className="flex flex-row gap-4 w-full">
          <div className="w-full">
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

          <div className="w-full">
            <label className="text-sm text-gray-400">Ratings</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Enter Product Rating"
              required
            />
          </div>
          <div className="w-full">
            <label className="text-sm text-gray-400">Set Reviews</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              placeholder="Enter Number Of Reviews"
              required
            />
          </div>
        </div>
        <div className="w-full flex flex-row gap-4">
          <div className="w-full">
            <label className="text-sm text-gray-400">
              Enter Special Badges
            </label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={badges}
              onChange={(e) => setBadges(e.target.value)}
              placeholder="Enter A Special Badge"
              required
            />
          </div>

          <div className="w-full">
            <label className="text-sm text-gray-400">
              Enter Product Features
            </label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Product Features"
              required
            />
          </div>
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
