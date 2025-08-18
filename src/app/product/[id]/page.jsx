"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAppContext } from "@/Context/AppContext";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/LumiraFooter";
import { Loading, LottieLoading } from "@/Components/Loading";
import PriceTag from "@/Components/PriceTag";
import { Input } from "@/Components/UI/input";
import Image from "next/image";
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
} from "lucide-react";
import { Badge } from "@/Components/UI/badge";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import ProductCard from "../../../Components/ProductCard";
import { useUser } from "@clerk/nextjs";
import ProductHighlights from "@/Components/ProductsHighlights";
import FeaturedProducts from "@/Components/FeaturedProducts";
import { db } from "../../../../Config/firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import { Country, State, City } from "country-state-city";
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

const Product = () => {
  const { id } = useParams();
  const {
    products,
    cartItems,
    addToCart,
    updateCartQuantity,
    Currency,
    router,
    loading,
    setLoading,
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    deleteFromLocalCart,
    Symbol,
  } = useAppContext();

  const [productData, setProductData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isSignedIn } = useUser();
  const [allVariants, setAllVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [shippingOptions, setShippingOptions] = useState([]);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const allCountries = Country.getAllCountries();
  const [queryCountry, setQueryCountry] = useState("");
  const [queryCode, setQueryCode] = useState("");

  const [filteredCountries, setFilteredCountries] = useState(allCountries);
  const [dropdownCountry, setDropdownCountry] = useState(false);

  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!countryRef.current?.contains(e.target)) setDropdownCountry(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDropdownCountry(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleCountryInput = (e) => {
    const input = e.target.value;
    setQueryCountry(input);
    const filtered = allCountries.filter((country) =>
      country.name.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredCountries(filtered);
    setDropdownCountry(true);
  };

  const handleSelectCountry = (country) => {
    setQueryCountry(country.name);
    setQueryCode(country.isoCode);
    setDropdownCountry(false);
  };

  const calculateShipping = async () => {
    if (!selectedVariant?.vid) {
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
          variantId: selectedVariant.vid, // ✅ CJ variant ID
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setShippingOptions(data.data);
      } else {
        setShippingOptions([]);
      }
    } catch (err) {
      console.error("Error fetching shipping:", err);
    } finally {
      setLoadingShipping(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(products)) {
      const found = products.find((p) => p.id === id);
      setProductData(found || null);
    }
  }, [id, products]);

  useEffect(() => {
    if (!productData) return; // prevent running if no ID
    setLoading(true);
    const fetchVariants = async () => {
      try {
        const variantsRef = collection(db, "products", id, "variants");
        const snapshot = await getDocs(variantsRef);

        const variantsData = snapshot.docs.map((doc) => ({
          id: doc.id, // variant doc id
          ...doc.data(),
        }));

        setAllVariants(variantsData);
        window.scrollTo(0, 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    };

    fetchVariants();
  }, [productData]); // re-run when productId changes

  if (loading) return <LottieLoading />;

  if (!productData || !allVariants) return <LottieLoading />;

  const cartProduct = cartItems.find((item) => item.vid === selectedVariant.id);
  const cartQuantity = cartProduct?.quantity || 0;

  const localCartProduct = localCart.find((item) => item.id === id);
  const localCartQuantity = localCartProduct?.quantity || 0;
  const isInStock = productData.availableStock > 0;

  const saveOffer = (price, originalPrice) => {
    if (originalPrice - price > 0) {
      return true;
    }
  };

  const images = [productData.mainImage, ...(productData.imageUrl || [])];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };
  const variantImageSelection = (url, id) => {
    const imageIndex = images.findIndex((img) => img === url);
    const variant = allVariants.find((v) => v.id === id);

    if (imageIndex !== -1 && variant) {
      setCurrentImageIndex(imageIndex);
      setSelectedVariant(variant);
    }
  };
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

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-n-secondary/20 group">
              <div className="flex items-center justify-center">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${productData.name} image ${currentImageIndex + 1}`}
                  width={800}
                  height={800}
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
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-n-background/80 hover:bg-n-background opacity-100"
                    onClick={nextImage}
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
                  >
                    <Image
                      src={img}
                      alt={`thumb-${idx}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Product Detailed Description */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {productData.badge && (
              <Badge className="mb-2" variant="secondary">
                {productData.badge}
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-n-foreground">
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex gap-2 items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(productData.rating || 0)
                      ? "fill-n-primary text-n-primary"
                      : "text-n-muted_foreground"
                  }`}
                />
              ))}
              <span className="text-sm text-n-muted_foreground">
                {productData.rating} ({productData.reviews} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-n-foreground">
                {/* {currency} */}

                {Currency === "USD" ? (
                  selectedVariant.id === undefined ? (
                    <>
                      {productData.price}
                      {Symbol}
                    </>
                  ) : (
                    <>
                      {selectedVariant.lumiraPrice}
                      {Symbol}
                    </>
                  )
                ) : !selectedVariant ? (
                  <>
                    <PriceTag
                      basePrice={productData.price}
                      userCurrency={Currency}
                      symbol={Symbol}
                    />
                  </>
                ) : (
                  <>
                    <PriceTag
                      basePrice={selectedVariant.lumiraPrice}
                      userCurrency={Currency}
                      symbol={Symbol}
                    />
                  </>
                )}
              </span>
              {saveOffer(productData.price, productData.originalPrice) && (
                <>
                  <span className="text-xl text-n-muted_foreground line-through">
                    {Currency === "USD" ? (
                      selectedVariant.id === undefined ? (
                        <>
                          {productData.originalPrice}
                          {Symbol}
                        </>
                      ) : (
                        <>
                          {selectedVariant.originalPrice}
                          {Symbol}
                        </>
                      )
                    ) : !selectedVariant ? (
                      <>
                        <PriceTag
                          basePrice={selectedVariant.originalPrice}
                          userCurrency={Currency}
                          symbol={Symbol}
                        />
                      </>
                    ) : (
                      <>
                        <PriceTag
                          basePrice={selectedVariant.originalPrice}
                          userCurrency={Currency}
                          symbol={Symbol}
                        />
                      </>
                    )}
                  </span>
                  <Badge variant="destructive">
                    {Currency === "USD" ? (
                      <>
                        Save {Symbol}
                        {selectedVariant.originalPrice -
                          selectedVariant.lumiraPrice}
                      </>
                    ) : (
                      <>
                        Save {Symbol}
                        <PriceTag
                          basePrice={
                            selectedVariant.originalPrice -
                            selectedVariant.lumiraPrice
                          }
                          userCurrency={Currency}
                        />
                      </>
                    )}
                  </Badge>
                </>
              )}
            </div>
            <p className="text-xl text-n-muted_foreground font-bold">
              Select Available Varient
            </p>
            <div className="flex flex-wrap gap-2">
              {allVariants.map((v, idx) => (
                <div
                  onClick={() => variantImageSelection(v.cjImage, v.id)}
                  key={idx}
                  className={`cursor-pointer w-16 h-16 sm:w-20 sm:h-20 border border-n-border rounded overflow-hidden flex items-center justify-center bg-white ${
                    v.id === selectedVariant.id
                      ? "border-n-primary ring-2 ring-n-primary/20"
                      : "border-n-border hover:border-n-primary/50"
                  }`}
                >
                  <Image
                    src={v.cjImage}
                    alt={v.cjKey || `variant-${idx}`}
                    width={90}
                    height={90}
                    className="w-full h-full object-contain"
                    loading="lazy" // ✅ don't block first render
                    quality={70} // ✅ optimized quality
                  />
                </div>
              ))}
            </div>

            {/* Features */}

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground">Key Features:</h3>
              <div className="grid grid-cols-1 gap-2">
                {productData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-n-primary" />
                    <span className="text-n-muted_foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-md font-bold text-n-foreground">
              Selected Variant: {selectedVariant.cjKey}
            </p>
            {/* ✅ Shipping Cost Calculator UI */}
            <div className="mt-6 p-4 border border-n-border rounded-xl bg-n-secondary/20 space-y-3">
              <h3 className="font-semibold text-n-foreground flex items-center gap-2">
                <Truck className="w-5 h-5 text-n-primary" /> Calculate Shipping
                Cost
              </h3>

              {/* Country Input */}
              <div className="grid grid-cols-1 space-y-2 md:grid-cols-2 md:space-x-3 md:space-y-0">
                <div className="flex flex-col gap-2">
                  <div ref={countryRef} className="relative space-y-2">
                    <Input
                      required
                      type="text"
                      placeholder={countryName ? countryName : "Select country"}
                      value={queryCountry}
                      onChange={handleCountryInput}
                      onFocus={() => setDropdownCountry(true)}
                      className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                    />
                    {dropdownCountry && (
                      <ul className="absolute bottom-full z-10 w-full max-h-60 overflow-auto ring-2 ring-n-primary/20 border-n-primary transition-all duration-300 bg-white border rounded shadow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        {filteredCountries.map((country) => (
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
                <Button
                  onClick={calculateShipping}
                  className="w-full overflow-hidden text-start"
                >
                  Check Shipping Options
                </Button>
              </div>
              {/* Placeholder for Result */}
              <div className="text-sm text-n-muted_foreground italic font-bold">
                {shippingOptions.length > 0 ? (
                  <>Detailed Shipping Info Will Be Provided At Checkout Page.</>
                ) : (
                  <>
                    Select destination country to check available shipping
                    methods/Info.
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
                    <div key={idx} className="p-2 border rounded-lg bg-white">
                      <p className="font-medium text-n-foreground">
                        {opt.logisticName === "CJPacket Asia Liquid Line" ? (
                          <>Standard Shipping</>
                        ) : (
                          <>{opt.logisticName}</>
                        )}
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
              {selectedVariant.id != undefined ? (
                isSignedIn ? (
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
                              cartQuantity - 1
                            )
                          }
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
                        onClick={() => removeFromLocalCart(selectedVariant.id)}
                      >
                        -
                      </button>
                      <span>{localCartQuantity}</span>
                      <button
                        onClick={() =>
                          addToLocalCart(productData.id, selectedVariant.id)
                        }
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
                <>
                  <Button className="flex-1 opacity-50">
                    <ShoppingCart className="mr-2 h-5 w-5" /> First Select A
                    Variant
                  </Button>
                </>
              )}
              <Button variant="outline">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
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
                    productData.availableStock > 20
                      ? "text-emerald-700"
                      : "text-cyan-900"
                  }`}
                >
                  {"("}
                  {productData.availableStock}
                  {")"}
                  {productData.availableStock > 20 ? "" : " Almost Out 🔥🔥"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xl text-n-muted_foreground font-bold mb-3">
              Product Description
            </p>
            {productData.description && (
              <div
                className="bg-n-background border border-n-foreground rounded-xl p-4 space-y-2 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-n-muted_foreground scrollbar-track-transparent"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            )}
          </div>
        </div>
        {/* Tabs / Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" /> Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* {Object.entries(productData.specifications || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b last:border-none"
                  >
                    <span className="text-n-muted_foreground">{key}</span>
                    <span className="text-n-foreground font-medium">
                      {value}
                    </span>
                  </div>
                )
              )} */}
              {selectedVariant.id === undefined ? (
                <>
                  <div className="py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">
                      Select A Variant First
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Height</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjHeight} mm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Width</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjWidth} mm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Length</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjLength} mm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">
                      Package Size
                    </span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjHeight} {"*"}{" "}
                      {selectedVariant?.cjWidth} {"*"}{" "}
                      {selectedVariant?.cjLength}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b last:border-none">
                    <span className="text-n-muted_foreground">Weight</span>
                    <span className="text-n-foreground font-medium">
                      {selectedVariant?.cjWeight} g
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
                    {productData.specifications?.Warranty} manufacturer warranty
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

        {/* Featured Products */}
        <div className="pt-24">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-semibold text-n-foreground">
              Featured <span className="text-orange-600">Products</span>
            </h2>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
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
      <Footer />
    </>
  );
};

export default Product;
