"use client";

import Button from "./Button";
import { useAppContext } from "../Context/AppContext";
import { useState } from "react";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import UploadProduct from "../../models/StockUpdater";
import toast from "react-hot-toast";

// Convert Google Drive link or ID into direct view URL
const sanitizeImageUrl = (url) => {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)\/view/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  const shareMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (shareMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${shareMatch[1]}`;
  }
  return url;
};

const formatMainImage = (url) => {
  const isDriveIdOnly = /^[a-zA-Z0-9_-]{25,}$/.test(url);
  if (isDriveIdOnly) {
    return `https://drive.google.com/uc?export=view&id=${url}`;
  }
  return sanitizeImageUrl(url);
};

const AddCJProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [availableStock, setAvailableStock] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState("");
  const [badges, setBadges] = useState([]);
  const [currentBadge, setCurrentBadge] = useState("");
  const [features, setFeatures] = useState([]);
  const [currentFeature, setCurrentFeature] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [cjProductId, setCjProductId] = useState("");
  const [cjPrice, setCjPrice] = useState("");
  const [CJVariants, setCJVariants] = useState([]);

  const handleFetchCJProduct = async () => {
    try {
      const res = await fetch(`/api/cj-product?pid=${cjProductId}`);
      const data = await res.json();
      console.log("CJ Product data", data);
      if (data.code !== 200) {
        toast.error("Failed to fetch CJ product");
        return;
      }
      const product = data.data;
      setName(product?.productNameEn || "");
      setOriginalPrice(product?.originalPrice || "");
      setMainImage(product?.productImageSet?.[0] || "");
      setImageUrl(product?.productImageSet || []);
      setAvailableStock(product?.totalStock || 0);
      setCategory(product?.categoryName || "");
      setDescription(product?.description || "");
      setCjPrice(product?.sellPrice || "");
      setCJVariants(product?.variants || []);
      toast.success("CJ product loaded!");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching CJ product");
    }
  };

  const handleAddImageUrl = () => {
    if (currentImageUrl.trim() !== "") {
      const sanitized = sanitizeImageUrl(currentImageUrl.trim());
      setImageUrl((prev) => [...prev, sanitized]);
      setCurrentImageUrl("");
    }
  };

  const handleRemoveImageUrl = (idx) => {
    setImageUrl((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveVariant = (vid) => {
    setCJVariants((prev) => prev.filter((item) => item.vid !== vid));
  };

  const handleAddFeature = () => {
    if (currentFeature.trim() !== "") {
      setFeatures((prev) => [...prev, currentFeature.trim()]);
      setCurrentFeature("");
    }
  };

  const handleRemoveFeature = (idx) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddBadge = () => {
    if (currentBadge.trim()) {
      setBadges((prev) => [...prev, currentBadge.trim()]);
      setCurrentBadge("");
    }
  };

  const handleRemoveBadge = (idx) => {
    setBadges((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await UploadProduct({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      cjProductId: cjProductId || null,
      cjPrice: cjPrice ? Number(cjPrice) : null,
      mainImage: formatMainImage(mainImage),
      imageUrl: imageUrl.map(sanitizeImageUrl),
      availableStock: Number(availableStock),
      description,
      rating: rating ? Number(rating) : null,
      reviews: reviews ? Number(reviews) : null,
      badges,
      features,
      category,
      cjVariants: CJVariants, // ⬅️ added this
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
    setBadges([]);
    setFeatures([]);
    setCategory("");
    setCurrentBadge("");
    setCurrentFeature("");
    setCjProductId("");
    setCjPrice("");
    setCJVariants([]);
  };

  return (
    <div className="max-w-2xl lg:max-w-[60%] mt-12 sm:mx-auto md:mx-2 w-full px-4">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Upload New Product
      </h2>

      {/* CJ Product Import */}
      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <label className="text-sm text-gray-400">CJ Product ID</label>
        <div className="flex gap-2 mt-1">
          <input
            className="flex-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            type="text"
            value={cjProductId}
            onChange={(e) => setCjProductId(e.target.value)}
            placeholder="Enter CJ Product ID"
          />
          <button
            type="button"
            onClick={handleFetchCJProduct}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Fetch from CJ
          </button>
        </div>
        {cjPrice && (
          <p className="mt-2 text-gray-300">
            CJ Price: <span className="font-bold">${cjPrice}</span>
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] p-6 rounded-xl shadow-lg border border-gray-700 space-y-5"
      >
        {/* Product Name */}
        <div>
          <label className="text-sm text-gray-400">Product Name</label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Product Category */}
        <div>
          <label className="text-sm text-gray-400">Product Category</label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            required
          />
        </div>

        {/* Price Fields */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-sm text-gray-400">Price</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
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
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter original price"
              required
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="text-sm text-gray-400">
            Main Image URL or Drive ID
          </label>
          <input
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="Drive ID or full image URL"
            required
          />
        </div>

        {/* Additional Images */}
        <div>
          <label className="text-sm text-gray-400">Sub Image URLs</label>
          <div className="flex gap-2 mt-1">
            <input
              className="flex-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
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
              Add
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            <div className="mt-2 max-h-60 overflow-y-auto border border-gray-700 rounded-md p-2">
              {imageUrl.map((url, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-sm justify-between bg-gray-800 p-2 rounded-md mb-1"
                >
                  <div className="flex flex-row">
                    <span className="text-gray-300 mr-4 text-sm">
                      {idx + 1} {": "}
                    </span>
                    <img
                      src={url}
                      alt={url || "Variant"}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(idx)}
                    className="text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </div>
          </ul>
        </div>

        {/* Variants Display */}
        {/* Variants Display with Lumira Price input */}
        {CJVariants.length > 0 && (
          <div>
            <label className="text-sm text-gray-400">CJ Variants</label>
            <div className="mt-2 max-h-60 overflow-y-auto border border-gray-700 rounded-md p-2 space-y-2">
              {CJVariants.map((variant, idx) => (
                <div
                  key={variant.vid}
                  className="flex items-center gap-3 bg-gray-800 p-2 rounded-md"
                >
                  {/* Variant Image */}
                  {idx + 1} {": "}
                  <img
                    src={variant.variantImage}
                    alt={variant.variantNameEn || "Variant"}
                    className="w-12 h-12 object-cover rounded"
                  />
                  {/* Variant Info */}
                  <div className="flex-1">
                    <p className="text-gray-200 text-sm font-semibold">
                      {/* {variant.variantNameEn || variant.vid} */}
                      {variant.vid}
                    </p>
                    <p className="text-gray-400 text-xs">
                      CJ Price: ${variant.variantSellPrice}
                    </p>
                  </div>
                  {/* Lumira Price Input */}
                  <input
                    required
                    type="number"
                    value={variant.lumiraPrice || ""}
                    onChange={(e) => {
                      const updated = [...CJVariants];
                      updated[idx].lumiraPrice = e.target.value;
                      setCJVariants(updated);
                    }}
                    placeholder="Your Price"
                    className="w-24 p-1 bg-gray-900 text-white border border-gray-600 rounded"
                  />
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(variant.vid)}
                    className="text-red-400 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* {CJVariants.length > 0 && (
          <div>
            <label className="text-sm text-gray-400">CJ Variants</label>
            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-700 rounded-md p-2">
              {CJVariants.map((variant, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded-md mb-1"
                >
                  <span className="text-gray-300 text-sm">
                    {variant?.variantNameEn || "Unnamed Variant"} —{" "}
                    {idx + 1} {": "}
                    {variant?.vid || "Unnamed Variant"} — $
                    {variant?.variantSellPrice || "N/A"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(variant.vid)}
                    className="text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Stock / Rating / Reviews */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-sm text-gray-400">Available Stock</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              type="number"
              value={availableStock}
              onChange={(e) => setAvailableStock(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <label className="text-sm text-gray-400">Ratings</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <label className="text-sm text-gray-400">Reviews</label>
            <input
              className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              type="number"
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Badges */}
        <div>
          <label className="text-sm text-gray-400">Special Badges</label>
          <div className="flex mt-1 gap-1">
            <input
              className="flex-1 p-2 bg-gray-800 text-white rounded-l-md border border-gray-600"
              type="text"
              value={currentBadge}
              onChange={(e) => setCurrentBadge(e.target.value)}
              placeholder="Enter a badge"
            />
            <button
              type="button"
              className="px-4 bg-blue-500 text-white rounded-r-md"
              onClick={handleAddBadge}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full"
              >
                <span>{badge}</span>
                <button
                  type="button"
                  className="ml-2 text-red-400 hover:text-red-600"
                  onClick={() => handleRemoveBadge(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="text-sm text-gray-400">Product Features</label>
          <div className="flex mt-1 gap-1">
            <input
              className="flex-1 p-2 bg-gray-800 text-white rounded-l-md border border-gray-600"
              type="text"
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              placeholder="Enter a feature"
            />
            <button
              type="button"
              className="px-4 bg-blue-500 text-white rounded-r-md"
              onClick={handleAddFeature}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  className="ml-2 text-red-400 hover:text-red-600"
                  onClick={() => handleRemoveFeature(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows={3}
            required
          />
        </div>

        <Button className="mt-5 xl:mt-0" type="submit">
          Upload Product
        </Button>
        <ButtonGradient />
      </form>
    </div>
  );
};

export default AddCJProduct;
