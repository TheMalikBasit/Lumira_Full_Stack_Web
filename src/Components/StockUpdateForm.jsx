"use client";

import Button from "./Button";
import { useEffect, useState } from "react";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import UpdateProduct from "../../models/UpdateProduct";
import DeleteProduct from "../../models/DeleteProduct";
import { db } from "../../Config/firebase";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";

// --- Google Drive Helpers ---
const sanitizeImageUrl = (url) => {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)\/view/);
  if (driveMatch?.[1])
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  const shareMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (shareMatch?.[1])
    return `https://drive.google.com/uc?export=view&id=${shareMatch[1]}`;
  return url;
};
const formatMainImage = (url) =>
  /^[a-zA-Z0-9_-]{25,}$/.test(url)
    ? `https://drive.google.com/uc?export=view&id=${url}`
    : sanitizeImageUrl(url);

const StockUpdateForm = ({ id }) => {
  // --- State ---
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

  // --- Fetch product data from Firestore ---
  const fetchProduct = async () => {
    if (!id) return;
    const productRef = doc(collection(db, "products"), id);
    const snap = await getDoc(productRef);
    const variantsRef = collection(db, "products", id, "variants");
    const snapshot = await getDocs(variantsRef);

    const variantsData = snapshot.docs.map((d) => ({
      ...d.data(),
    }));

    if (snap.exists()) {
      const p = snap.data();
      setName(p.name || "");
      setPrice(p.price || "");
      setMainImage(p.mainImage || "");
      setImageUrl(p.imageUrl || []);
      setAvailableStock(p.availableStock || "");
      setDescription(p.description || "");
      setRating(p.rating || "");
      setReviews(p.reviews || "");
      setBadges(p.badges || []);
      setFeatures(p.features || []);
      setOriginalPrice(p.originalPrice || "");
      setCategory(p.category || "");
      setCjProductId(p.cjProductId || "");
      setCjPrice(p.cjPrice || "");
    }
    if (Array.isArray(variantsData) && variantsData.length > 0) {
      setCJVariants(variantsData);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // --- Image Handling ---
  const handleAddImageUrl = () => {
    if (currentImageUrl.trim()) {
      setImageUrl((prev) => [
        ...prev,
        sanitizeImageUrl(currentImageUrl.trim()),
      ]);
      setCurrentImageUrl("");
    }
  };
  const handleRemoveImageUrl = (idx) => {
    setImageUrl((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Feature Handling ---
  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFeatures((prev) => [...prev, currentFeature.trim()]);
      setCurrentFeature("");
    }
  };
  const handleRemoveFeature = (idx) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Badge Handling ---
  const handleAddBadge = () => {
    if (currentBadge.trim()) {
      setBadges((prev) => [...prev, currentBadge.trim()]);
      setCurrentBadge("");
    }
  };
  const handleRemoveBadge = (idx) => {
    setBadges((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Variant Handling ---
  const handleRemoveVariant = (vid) => {
    setCJVariants((prev) => prev.filter((v) => v.vid !== vid));
  };

  // --- Form Actions ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    await UpdateProduct({
      id,
      name,
      price: price,
      mainImage: formatMainImage(mainImage),
      imageUrl: imageUrl.map(sanitizeImageUrl),
      availableStock: Number(availableStock),
      description,
      rating: Number(rating),
      reviews: Number(reviews),
      badges,
      features,
      originalPrice: originalPrice || null,
      category,
      cjProductId: cjProductId || null,
      cjPrice: cjPrice || null,
      cjVariants: CJVariants || [],
    });
  };

  const handleDelete = async () => {
    await DeleteProduct({ id });
  };

  // --- UI ---
  return (
    <div className="max-w-2xl lg:max-w-[50%] mt-12 sm:mx-auto md:mx-2 w-full px-4">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Update Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] p-6 rounded-xl shadow-lg border border-gray-700 space-y-5"
      >
        {/* CJ Product Info */}
        <div>
          <label className="text-sm text-gray-400">CJ Product ID</label>
          <input
            type="text"
            value={cjProductId}
            onChange={(e) => setCjProductId(e.target.value)}
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">CJ Price</label>
          <input
            type="text"
            value={cjPrice}
            onChange={(e) => setCjPrice(e.target.value)}
            className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
          />
        </div>

        {/* Product Name + Category */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="product-name" className="text-sm text-gray-400">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="category" className="text-sm text-gray-400">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              required
            />
          </div>
        </div>

        {/* Prices */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="price" className="text-sm text-gray-400">
              Lumira Price
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="original-price" className="text-sm text-gray-400">
              Lumira Original Price
            </label>
            <input
              type="text"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Original Price"
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
              required
            />
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label className="text-sm text-gray-400">Main Image</label>
          <input
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="Image URL / Drive ID"
            className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
          />
        </div>

        {/* Additional Images */}
        <div>
          <label className="text-sm text-gray-400">Sub Images</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentImageUrl}
              onChange={(e) => setCurrentImageUrl(e.target.value)}
              placeholder="Add image URL"
              className="flex-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="bg-blue-600 px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            <div className="mt-2 min-h-60 max-h-60 overflow-y-auto border border-gray-700 rounded-md p-2">
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

        {/* Variants */}
        <div>
          <label className="text-sm text-gray-400">CJ Variants</label>
          <div className="mt-2 min-h-60 max-h-60 overflow-y-auto border border-gray-700 rounded-md p-2 space-y-2">
            {CJVariants.map((v, idx) => (
              <div
                key={v.vid}
                className="flex items-center gap-3 bg-gray-800 p-2 rounded-md"
              >
                {idx + 1} {": "}
                <img
                  src={v.cjImage || ""}
                  alt=""
                  className="w-12 h-12 rounded"
                />
                <div className="flex-1">
                  <p className="text-gray-200">{v.cjKey || v.vid}</p>
                  <p className="text-gray-400 text-xs">
                    CJ: ${v.cjPrice || "N/A"}
                  </p>
                </div>
                <input
                  type="number"
                  value={v.lumiraPrice || ""}
                  onChange={(e) => {
                    const upd = [...CJVariants];
                    upd[idx].lumiraPrice = e.target.value;
                    setCJVariants(upd);
                  }}
                  placeholder="Your Price"
                  className="w-24 p-1 bg-gray-900 border border-gray-600 rounded"
                />
                <input
                  type="number"
                  value={v.originalPrice || ""}
                  onChange={(e) => {
                    const upd = [...CJVariants];
                    upd[idx].originalPrice = e.target.value;
                    setCJVariants(upd);
                  }}
                  placeholder="Original"
                  className="w-24 p-1 bg-gray-900 border border-gray-600 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(v.vid)}
                  className="text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stock / Ratings / Reviews */}
        <div className="flex gap-4">
          <input
            type="number"
            value={availableStock}
            onChange={(e) => setAvailableStock(e.target.value)}
            placeholder="Stock"
            className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            required
          />
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Rating"
            className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            required
          />
          <input
            type="number"
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
            placeholder="Reviews"
            className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            required
          />
        </div>

        {/* Badges */}
        <div>
          <label className="text-sm text-gray-400">Badges</label>
          <div className="flex gap-2">
            <input
              value={currentBadge}
              onChange={(e) => setCurrentBadge(e.target.value)}
              placeholder="Add badge"
              className="flex-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            />
            <button
              type="button"
              onClick={handleAddBadge}
              className="bg-blue-600 px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <span
                key={i}
                className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {b}
                <button
                  onClick={() => handleRemoveBadge(i)}
                  className="text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="text-sm text-gray-400">Features</label>
          <div className="flex gap-2">
            <input
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              placeholder="Add feature"
              className="flex-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-blue-600 px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {features.map((f, i) => (
              <span
                key={i}
                className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {f}
                <button
                  onClick={() => handleRemoveFeature(i)}
                  className="text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
          required
        />

        {/* Buttons */}
        <div className="flex justify-between">
          <Button type="submit">Update</Button>
          <Button type="button" white onClick={handleDelete}>
            Delete
          </Button>
        </div>
        <ButtonGradient />
      </form>
    </div>
  );
};

export default StockUpdateForm;
