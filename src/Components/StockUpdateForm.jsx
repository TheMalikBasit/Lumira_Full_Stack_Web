"use client";

import Button from "./Button";
import { useAppContext } from "../Context/AppContext";
import { useEffect, useState } from "react";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import UpdateProduct from "../../models/UpdateProduct";

import { db } from "../../Config/firebase";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import DeleteProduct from "../../models/DeleteProduct";

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

const StockUpdateForm = ({ id }) => {
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
  const [originalPrice, setOriginalPrice] = useState(0);
  const [category, setCategory] = useState("");

  const fetchProduct = async () => {
    const productId = id;
    const productRef = doc(collection(db, "products"), productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data();
      setName(productData.name || "");
      setPrice(productData.price || "");
      setMainImage(productData.mainImage || "");
      setImageUrl(productData.imageUrl || []);
      setAvailableStock(productData.availableStock || "");
      setDescription(productData.description || "");
      setRating(productData.rating || "");
      setReviews(productData.reviews || "");
      setBadges(productData.badges || []);
      setFeatures(productData.features || []);
      setOriginalPrice(productData.originalPrice || "");
      setCategory(productData.category || "");
    }
    console.log("Product ID:", productId);
    console.log("Fetched product:", productSnap.data());
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

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
  const handleAddFeature = (e) => {
    e.preventDefault();
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

  const handleDelete = async (e) => {
    e.preventDefault();
    await DeleteProduct({ id });
    // Optional: clear fields
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await UpdateProduct({
      id,
      name,
      price: Number(price),
      mainImage: formatMainImage(mainImage),
      imageUrl: imageUrl.map(sanitizeImageUrl),
      availableStock: Number(availableStock),
      description,
      rating: Number(rating),
      reviews: Number(reviews),
      badges,
      features,
      originalPrice: Number(originalPrice),
      category,
    });

    // Optional: clear fields
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
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setMainImage("");
    setImageUrl([]);
    setCurrentImageUrl("");
    setAvailableStock("");
    setDescription("");
    setRating("");
    setReviews("");
    setBadges([]);
    setFeatures([]);
    setOriginalPrice("");
    setCategory("");
  };
  return (
    <div className="max-w-2xl lg:max-w-[45%] mt-12 sm:mx-auto md:mx-2 w-full px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-orange-600">Update Product</h2>
        <p className="font-bold text-orange-600">
          (Select a product from All Products)
        </p>
      </div>
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
          {/* Special Badges Input */}
          <div className="w-full">
            <label className="text-sm text-gray-400">
              Enter Special Badges
            </label>
            <div className="flex mt-1 gap-1">
              <input
                className="flex-1 p-2 bg-gray-800 text-white rounded-l-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={currentBadge}
                onChange={(e) => setCurrentBadge(e.target.value)}
                placeholder="Enter A Special Badge"
              />
              <button
                className="px-4 bg-blue-500 text-white rounded-r-md"
                onClick={handleAddBadge}
              >
                OK
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
                    className="ml-2 text-red-400 hover:text-red-600"
                    onClick={() => handleRemoveBadge(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Features Input */}
          <div className="w-full">
            <label className="text-sm text-gray-400">
              Enter Product Features
            </label>
            <div className="flex mt-1 gap-1">
              <input
                className="flex-1 p-2 bg-gray-800 text-white rounded-l-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                placeholder="Product Features"
              />
              <button
                className="px-4 bg-blue-500 text-white rounded-r-md"
                onClick={handleAddFeature}
              >
                OK
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
                    className="ml-2 text-red-400 hover:text-red-600"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
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
          <Button className=" mt-5 xl:mt-0" type="submit">
            Update Product
          </Button>
          <Button className=" mt-5 xl:mt-0" type="button" onclick={clearForm}>
            Clear Form
          </Button>
          <Button className="mt-5 xl:mt-0" white onclick={handleDelete}>
            Delete Product
          </Button>
        </div>
        <ButtonGradient />
      </form>
    </div>
  );
};

export default StockUpdateForm;
