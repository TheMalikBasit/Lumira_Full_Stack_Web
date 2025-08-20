"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { collection, getDocs } from "firebase/firestore";
import SupportModal from "@/Components/SupportModal";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/LumiraFooter";
import { LottieLoading } from "@/Components/Loading";
import PriceTag from "@/Components/PriceTag";
import { Input } from "@/Components/UI/input";
import { Badge } from "@/Components/UI/badge";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useAppContext } from "@/Context/AppContext";
import { db } from "../../../../Config/firebase";

// ✅ Lazy-load heavy sections to improve FCP/LCP
const FeaturedProducts = dynamic(
  () => import("@/Components/FeaturedProducts"),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 text-sm text-n-muted_foreground">
        Loading featured products…
      </div>
    ),
  }
);
const ProductHighlights = dynamic(
  () => import("@/Components/ProductsHighlights"),
  { ssr: false, loading: () => null }
);

// Skeleton for variants
function VariantsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const {
    products,
    cartItems,
    addToCart,
    updateCartQuantity,
    Currency,
    router,
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    Symbol,
  } = useAppContext();

  const { isSignedIn } = useUser();

  // --- local state
  const [productData, setProductData] = useState(null);
  const [allVariants, setAllVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // shipping calc
  const [shippingOptions, setShippingOptions] = useState([]);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Countries
  const [allCountries, setAllCountries] = useState([]);
  const [queryCountry, setQueryCountry] = useState("");
  const [queryCode, setQueryCode] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [dropdownCountry, setDropdownCountry] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [currentStock, setCurrentStock] = useState(null);

  const countryRef = useRef(null);

  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    section: "",
  });

  const sampleReviews = [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Absolutely love this lamp! The quality is excellent and it looks great in my home office.",
      verified: true,
    },
    {
      id: 2,
      user: "John D.",
      rating: 4,
      date: "1 month ago",
      comment:
        "Great product, very satisfied with the purchase. The adjustable features work perfectly.",
      verified: true,
    },
  ];

  // Always scroll to top when this page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const getInventory = async (vid) => {
    if (!vid) return;

    try {
      setCurrentStock(-1);
      const res = await fetch(`/api/get-inventory?vid=${vid}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const inventory = data.data[0] || {};
      console.log("Inventory data:", inventory?.totalInventoryNum);
      setCurrentStock(inventory?.totalInventoryNum);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  // Close dropdown on outside click / ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!countryRef.current?.contains(e.target)) setDropdownCountry(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setDropdownCountry(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Load product by id from context (non-blocking)
  useEffect(() => {
    if (!id || !Array.isArray(products)) return;
    const found = products.find((p) => p.id === id) || null;
    setProductData(found);
    // reset state on product change
    setSelectedVariant(null);
    setCurrentImageIndex(0);
    setShippingOptions([]);
  }, [id, products]);

  // ✅ Optimized fetch: First check localStorage, else fetch from Firestore
  useEffect(() => {
    let cancelled = false;
    async function fetchVariants() {
      if (!id) return;
      setVariantsLoading(true);

      try {
        // 1. Check localStorage
        const cached = localStorage.getItem("variantsCache");
        let cacheObj = cached ? JSON.parse(cached) : {};

        if (cacheObj[id]) {
          if (!cancelled) setAllVariants(cacheObj[id]);
          return;
        }

        // 2. If not in cache → fetch from Firestore
        const variantsRef = collection(db, "products", id, "variants");
        const snapshot = await getDocs(variantsRef);
        if (cancelled) return;

        const variantsData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // 3. Save to localStorage
        cacheObj[id] = variantsData;
        localStorage.setItem("variantsCache", JSON.stringify(cacheObj));

        setAllVariants(variantsData || []);
      } catch (e) {
        console.error("Error fetching variants:", e);
        setAllVariants([]);
      } finally {
        if (!cancelled) setVariantsLoading(false);
      }
    }
    fetchVariants();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Images memo
  const images = useMemo(() => {
    const main = productData?.mainImage ? [productData.mainImage] : [];
    const extras = Array.isArray(productData?.imageUrl)
      ? productData.imageUrl
      : [];
    const arr = [...main, ...extras].filter(Boolean);
    return arr.length > 0 ? arr : ["/placeholder.png"];
  }, [productData]);

  // Cart refs
  const cartProduct = useMemo(() => {
    if (!selectedVariant?.id || !Array.isArray(cartItems)) return null;
    return cartItems.find((item) => item.vid === selectedVariant.id) || null;
  }, [selectedVariant, cartItems]);
  const cartQuantity = cartProduct?.quantity || 0;

  const localCartProduct = useMemo(() => {
    if (!Array.isArray(localCart)) return null;
    return localCart.find((item) => item.id === id) || null;
  }, [localCart, id]);
  const localCartQuantity = localCartProduct?.quantity || 0;

  const isInStock = (productData?.availableStock || 0) > 0;

  const saveOffer = (price, originalPrice) =>
    typeof price === "number" &&
    typeof originalPrice === "number" &&
    originalPrice - price > 0;

  // Thumbnail/nav
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToImage = (i) => setCurrentImageIndex(i);

  const variantImageSelection = (url, vId) => {
    const idx = images.findIndex((img) => img === url);
    const v = allVariants.find((x) => x.id === vId) || null;
    if (idx >= 0) setCurrentImageIndex(idx);
    setSelectedVariant(v);
  };

  // Countries: lazy load
  const ensureCountriesLoaded = async () => {
    if (allCountries.length > 0) return;
    const mod = await import("country-state-city");
    const list = mod.Country.getAllCountries() || [];
    setAllCountries(list);
    setFilteredCountries(list);
  };

  const handleCountryInput = (e) => {
    const input = e.target.value;
    setQueryCountry(input);
    if (!allCountries.length) return;
    const filtered = allCountries.filter((c) =>
      c.name.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredCountries(filtered);
    setDropdownCountry(true);
  };

  const handleSelectCountry = (country) => {
    setQueryCountry(country.name);
    setCountryName(country.name);
    setQueryCode(country.isoCode);
    setDropdownCountry(false);
  };

  const calculateShipping = async () => {
    if (!selectedVariant?.vid && !selectedVariant?.id) {
      alert("Please select a variant first");
      return;
    }
    if (!queryCode) {
      alert("Please select a Country first");
      return;
    }
    setLoadingShipping(true);
    try {
      const res = await fetch("/api/calculate-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryCode,
          variantId: selectedVariant.vid || selectedVariant.id,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (data?.result && Array.isArray(data.data)) {
        setShippingOptions(data.data);
      } else {
        setShippingOptions([]);
      }
    } catch (err) {
      console.error("Error fetching shipping:", err);
      setShippingOptions([]);
    } finally {
      setLoadingShipping(false);
    }
  };
  console.log("Variants Data:", allVariants);
  // Early load guard
  // if (!productData) return <LottieLoading />;

  return (
    <>
      <Navbar bgBlur />
      <div className="min-h-screen bg-n-background px-4 lg:px-16 xl:px-32 pt-16 space-y-10 mt-10">
        <div
          onClick={() => router.push("/all-products")}
          className="cursor-pointer inline-flex items-center gap-2 text-n-muted_foreground hover:text-n-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </div>
        {!productData ? (
          <>
            <LottieLoading className={"min-h-screen relative"} />
          </>
        ) : (
          <>
            {/* Product Section */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Carousel */}
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden bg-n-secondary/20 group">
                  <div className="flex items-center justify-center">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`${productData.name || "Product"} image ${
                        currentImageIndex + 1
                      }`}
                      width={800}
                      height={800}
                      priority // ✅ critical image for better LCP
                      quality={75}
                      className="w-full h-auto max-h-[500px] object-contain transition-all duration-300"
                    />
                  </div>

                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-n-background/80 hover:bg-n-background opacity-100"
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-n-background/80 hover:bg-n-background opacity-100"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <div className="absolute bottom-4 right-4 bg-n-background/80 px-3 py-1 rounded-full text-sm text-n-foreground">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToImage(idx)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 border-n-border aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx
                            ? "border-n-primary ring-2 ring-n-primary/20"
                            : "border-n-border hover:border-n-primary/50"
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`thumb-${idx}`}
                          width={100}
                          height={100}
                          quality={50}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {productData?.badge && (
                  <Badge className="mb-2" variant="secondary">
                    {productData.badge}
                  </Badge>
                )}
                <h1 className="text-2xl font-bold text-n-foreground">
                  {productData?.name || "Product"}
                </h1>

                {/* Rating */}
                <div className="flex gap-2 items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(productData?.rating || 0)
                          ? "fill-n-primary text-n-primary"
                          : "text-n-muted_foreground"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-n-muted_foreground">
                    {productData?.rating || 0} ({productData?.reviews || 0}{" "}
                    reviews)
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-n-foreground">
                    {Currency === "USD" ? (
                      !selectedVariant ? (
                        <>
                          {productData?.price ?? 0}
                          {Symbol}
                        </>
                      ) : (
                        <>
                          {selectedVariant?.lumiraPrice ??
                            productData?.price ??
                            0}
                          {Symbol}
                        </>
                      )
                    ) : !selectedVariant ? (
                      <PriceTag
                        basePrice={productData?.price ?? 0}
                        userCurrency={Currency}
                        symbol={Symbol}
                      />
                    ) : (
                      <PriceTag
                        basePrice={selectedVariant?.lumiraPrice ?? 0}
                        userCurrency={Currency}
                        symbol={Symbol}
                      />
                    )}
                  </span>

                  {saveOffer(
                    selectedVariant?.lumiraPrice ?? productData?.price,
                    selectedVariant?.originalPrice ?? productData?.originalPrice
                  ) && (
                    <>
                      <span className="text-xl text-n-muted_foreground line-through">
                        {Currency === "USD" ? (
                          <>
                            {selectedVariant?.originalPrice ??
                              productData?.originalPrice ??
                              0}
                            {Symbol}
                          </>
                        ) : (
                          <PriceTag
                            basePrice={
                              selectedVariant?.originalPrice ??
                              productData?.originalPrice ??
                              0
                            }
                            userCurrency={Currency}
                            symbol={Symbol}
                          />
                        )}
                      </span>
                      <Badge variant="destructive">
                        {Currency === "USD" ? (
                          <>
                            Save {Symbol}
                            {(selectedVariant?.originalPrice ??
                              productData?.originalPrice ??
                              0) -
                              (selectedVariant?.lumiraPrice ??
                                productData?.price ??
                                0)}
                          </>
                        ) : (
                          <>
                            Save {Symbol}
                            <PriceTag
                              basePrice={
                                (selectedVariant?.originalPrice ??
                                  productData?.originalPrice ??
                                  0) -
                                (selectedVariant?.lumiraPrice ??
                                  productData?.price ??
                                  0)
                              }
                              userCurrency={Currency}
                            />
                          </>
                        )}
                      </Badge>
                    </>
                  )}
                </div>

                <div className="text-sm text-n-muted_foreground">
                  <div className="flex items-center gap-2 mb-1">
                    {currentStock != null ? (
                      currentStock != -1 ? (
                        <>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              currentStock > 0 ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {currentStock > 0 ? "In Stock" : "Out of Stock"}
                          <span
                            className={`${
                              currentStock > 20
                                ? "text-emerald-700"
                                : "text-cyan-900"
                            }`}
                          >
                            {" ("}
                            {currentStock ?? 0}
                            {") "}
                            {currentStock < 20 && currentStock > 0
                              ? "Almost Out 🔥🔥"
                              : ""}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className=" bg-n-background flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-4 text-n-foreground" />
                          </div>
                        </>
                      )
                    ) : (
                      <>
                        <p className="text-emerald-700 text-sm">
                          <span className="text-n-muted_foreground font-bold">
                            CURRENT STOCK:
                          </span>{" "}
                          Select A Variant
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xl text-n-muted_foreground font-bold">
                  Select Available Variant
                </p>

                {/* Variants */}
                {variantsLoading ? (
                  <VariantsSkeleton />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {allVariants.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          variantImageSelection(v.cjImage, v.id);
                          getInventory(v.vid);
                        }}
                        className={`cursor-pointer w-16 h-16 sm:w-20 sm:h-20 border rounded overflow-hidden flex items-center justify-center bg-white ${
                          v.id === selectedVariant?.id
                            ? "border-n-primary ring-2 ring-n-primary/20"
                            : "border-n-border hover:border-n-primary/50"
                        }`}
                      >
                        <Image
                          src={v.cjImage}
                          alt={v.cjKey || "variant"}
                          width={90}
                          height={90}
                          className="w-full object-contain"
                          loading="lazy"
                          quality={70}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-foreground">
                    Key Features:
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {(productData?.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-n-primary" />
                        <span className="text-n-muted_foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-md font-bold text-n-foreground">
                  Selected Variant: {selectedVariant?.cjKey || "—"}
                </p>

                {/* Shipping Cost Calculator */}
                <div className="mt-6 p-4 border border-n-border rounded-xl bg-n-secondary/20 space-y-3">
                  <h3 className="font-semibold text-n-foreground flex items-center gap-2">
                    <Truck className="w-5 h-5 text-n-primary" /> Calculate
                    Shipping Cost
                  </h3>

                  <div className="grid grid-cols-1 space-y-2 md:grid-cols-2 md:space-x-3 md:space-y-0">
                    <div className="flex flex-col gap-2">
                      <div ref={countryRef} className="relative space-y-2">
                        <Input
                          required
                          type="text"
                          placeholder={countryName || "Select country"}
                          value={queryCountry}
                          onChange={handleCountryInput}
                          onFocus={async () => {
                            setDropdownCountry(true);
                            await ensureCountriesLoaded();
                          }}
                          className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                        />
                        {dropdownCountry && filteredCountries.length > 0 && (
                          <ul className="absolute bottom-full z-10 w-full max-h-60 overflow-auto ring-2 ring-n-primary/20 border-n-primary transition-all duration-300 bg-white border rounded shadow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            {filteredCountries.slice(0, 100).map((country) => (
                              <li
                                key={country.isoCode}
                                onClick={() => handleSelectCountry(country)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {country.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <Button onClick={calculateShipping} className="w-full">
                      Check Shipping Options
                    </Button>
                  </div>

                  <div className="text-sm text-n-muted_foreground italic font-bold">
                    {shippingOptions.length > 0 ? (
                      <>Detailed shipping info will be provided at checkout.</>
                    ) : (
                      <>
                        Select destination country to check available methods.
                      </>
                    )}
                  </div>

                  {loadingShipping && (
                    <p className="text-sm text-n-muted_foreground">
                      Fetching shipping options...
                    </p>
                  )}

                  {shippingOptions.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {shippingOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className="p-2 border rounded-lg bg-white"
                        >
                          <p className="font-medium text-n-foreground">
                            {opt.logisticName === "CJPacket Asia Liquid Line"
                              ? "Standard Shipping"
                              : opt.logisticName}
                          </p>
                          <p className="text-sm text-n-muted_foreground">
                            ${opt.logisticPrice} · {opt.logisticAging} days
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !loadingShipping && (
                      <p className="text-sm text-n-muted_foreground italic">
                        No options found
                      </p>
                    )
                  )}
                </div>

                {/* Cart Actions */}
                <div className="flex items-center gap-3">
                  {selectedVariant?.id ? (
                    currentStock < 1 ? (
                      <Button
                        className="flex-1"
                        onClick={() =>
                          addToCart(productData.id, selectedVariant.id)
                        }
                        disabled
                      >
                        Out of Stock
                      </Button>
                    ) : isSignedIn ? (
                      !cartProduct ? (
                        <Button
                          className="flex-1"
                          onClick={() =>
                            addToCart(productData.id, selectedVariant.id)
                          }
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                      ) : (
                        <>
                          <div className="flex items-center border rounded min-w-[80px] max-w-[120px] py-2 px-2 justify-between">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  selectedVariant.id,
                                  Math.max(0, cartQuantity - 1)
                                )
                              }
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span>{cartQuantity}</span>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  selectedVariant.id,
                                  cartQuantity + 1
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <Button
                            className="flex-1 bg-n-lumira_coral text-white hover:bg-n-foreground"
                            onClick={() => router.push("/cart")}
                          >
                            Buy Now
                          </Button>
                        </>
                      )
                    ) : !localCartProduct ? (
                      <Button
                        className="flex-1"
                        onClick={() =>
                          addToLocalCart(productData.id, selectedVariant.id)
                        }
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                      </Button>
                    ) : (
                      <>
                        <div className="flex items-center border rounded min-w-[120px] py-2 px-2 justify-between">
                          <button
                            onClick={() =>
                              removeFromLocalCart(selectedVariant.id)
                            }
                            aria-label="Decrease local quantity"
                          >
                            -
                          </button>
                          <span>{localCartQuantity}</span>
                          <button
                            onClick={() =>
                              addToLocalCart(productData.id, selectedVariant.id)
                            }
                            aria-label="Increase local quantity"
                          >
                            +
                          </button>
                        </div>
                        <Button
                          className="flex-1 bg-n-foreground text-white hover:bg-n-spaceGradient"
                          onClick={() => router.push("/cart")}
                        >
                          Buy Now
                        </Button>
                      </>
                    )
                  ) : (
                    <Button className="flex-1 opacity-50" disabled>
                      <ShoppingCart className="mr-2 h-5 w-5" /> First Select A
                      Variant
                    </Button>
                  )}
                  <Button variant="outline" aria-label="Add to wishlist">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                {/* 
            <div className="text-sm text-n-muted_foreground">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isInStock ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {isInStock ? "In Stock" : "Out of Stock"}
                <span
                  className={`${
                    (productData?.availableStock || 0) > 20
                      ? "text-emerald-700"
                      : "text-cyan-900"
                  }`}
                >
                  {" ("}
                  {productData?.availableStock ?? 0}
                  {") "}
                  {(productData?.availableStock || 0) > 20
                    ? ""
                    : "Almost Out 🔥🔥"}
                </span>
              </div>
            </div> */}
              </div>

              {/* Description */}
              <div>
                <p className="text-xl text-n-muted_foreground font-bold mb-3">
                  Product Description
                </p>
                {productData?.description && (
                  <div
                    className="bg-n-background border border-n-foreground/20 rounded-xl p-4 space-y-2 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-n-muted_foreground scrollbar-track-transparent"
                    // ✅ ensure string only
                    dangerouslySetInnerHTML={{
                      __html: String(productData.description),
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
        {/* Other Sections (lazy) */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" /> Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!selectedVariant ? (
                <div className="py-2 border-b last:border-none">
                  <span className="text-n-muted_foreground">
                    Select a variant first
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Height</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjHeight ?? "—"} mm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Width</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjWidth ?? "—"} mm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Length</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjLength ?? "—"} mm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">
                      Package Size
                    </span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjHeight ?? "—"} {"× "}
                      {selectedVariant?.cjWidth ?? "—"} {"× "}
                      {selectedVariant?.cjLength ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Weight</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjWeight ?? "—"} g
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping & Returns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" /> Shipping & Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-n-primary mt-0.5" />
                <div>
                  <p className="font-medium text-n-foreground">Free Shipping</p>
                  <p className="text-sm text-n-muted_foreground">
                    On orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-n-primary mt-0.5" />
                <div>
                  <p className="font-medium text-n-foreground">
                    30-Day Returns
                  </p>
                  <p className="text-sm text-n-muted_foreground">
                    Easy returns and exchanges
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-n-primary mt-0.5" />
                <div>
                  <p className="font-medium text-n-foreground">Warranty</p>
                  <p className="text-sm text-n-muted_foreground">
                    {productData?.specifications?.Warranty ||
                      "Manufacturer warranty"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleReviews.map((review) => (
                <div
                  key={review.id}
                  className="space-y-2 pb-4 border-b border-n-border/50 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-n-foreground">
                      {review.user}
                    </span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-n-primary text-n-primary"
                              : "text-n-muted_foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-n-muted_foreground">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-sm text-n-muted_foreground">
                    {review.comment}
                  </p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products (lazy) */}
        <div className="pt-24">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-semibold text-n-foreground">
              Featured <span className="text-orange-600">Products</span>
            </h2>
            <div className="w-28 h-0.5 bg-orange-600 mt-2" />
          </div>
          <FeaturedProducts id={id} />
          <div className="text-center my-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/all-products")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </div>
      <Footer
        onSupportClick={(section) => setSupportModal({ isOpen: true, section })}
      />

      <SupportModal
        isOpen={supportModal.isOpen}
        onClose={() => setSupportModal({ isOpen: false, section: "" })}
        initialSection={supportModal.section}
      />
    </>
  );
}
