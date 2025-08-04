"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/Context/AppContext";
import Navbar from "../../../components/Navbar";
import Footer from "@/Components/LumiraFooter";
import { Loading, LottieLoading } from "@/Components/Loading";
import PriceTag from "@/Components/PriceTag";
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
// import {
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/Components/UI";
import { Badge } from "@/Components/UI/badge";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import ProductCard from "../../../Components/ProductCard";
import { useUser } from "@clerk/nextjs";
import ProductHighlights from "@/Components/ProductsHighlights";
import FeaturedProducts from "@/Components/FeaturedProducts";
// import {
//   fetchLocalCart,
//   addLocalProducts,
//   removeLocalProducts,
//   deleteLocalProducts,
//   clearLocalCart,
// } from "../../../../models/OfflineModules";

// Placeholder reviews
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
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    deleteFromLocalCart,
    Symbol,
  } = useAppContext();

  const [productData, setProductData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (Array.isArray(products)) {
      const found = products.find((p) => p.id === id);
      setProductData(found || null);
    }
  }, [id, products]);

  if (!productData) return <LottieLoading />;

  const cartProduct = cartItems.find((item) => item.id === id);
  const cartQuantity = cartProduct?.quantity || 0;

  const localCartProduct = localCart.find((item) => item.id === id);
  const localCartQuantity = localCartProduct?.quantity || 0;
  const isInStock = productData.availableStock > 0;

  console.log("Local cart product:", localCartProduct);
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

  // const handleAddLocalProduct = () => {
  //   addLocalProducts({ ID: productData.id });
  //   setLocalCartData(fetchLocalCart());
  // };

  // const handleRemoveLocalProduct = () => {
  //   removeLocalProducts({ ID: productData.id });
  //   setLocalCartData(fetchLocalCart());
  // };

  return (
    <>
      <Navbar relative />
      <div className="min-h-screen bg-n-background px-4 lg:px-16 xl:px-32 pt-16 space-y-10">
        {/* Breadcrumb */}
        {/* <div className="text-sm text-n-muted_foreground mb-4">
          <Link href="/" className="hover:text-n-foreground">
            Home
          </Link>{" "}
          /
          <Link href="/products" className="hover:text-n-foreground ml-1">
            Products
          </Link>{" "}
          /<span className="text-n-foreground ml-1">{productData.name}</span>
        </div> */}

        {/* Back Button */}
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
              <div className="h-96 w-full flex items-center justify-center">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${productData.name} image ${currentImageIndex + 1}`}
                  width={720}
                  height={520}
                  className="h-full w-auto object-contain transition-all duration-300"
                />
              </div>

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-n-background/80 hover:bg-n-background opacity-0 group-hover:opacity-100"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-n-background/80 hover:bg-n-background opacity-0 group-hover:opacity-100"
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
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? "border-n-primary ring-2 ring-n-primary/20"
                        : "border-n-border hover:border-n-primary/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`thumb-${idx}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {productData.badge && (
              <Badge className="mb-2" variant="secondary">
                {productData.badge}
              </Badge>
            )}
            <h1 className="text-4xl font-bold text-n-foreground">
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
                  <>
                    {productData.price}
                    {Symbol}
                  </>
                ) : (
                  <PriceTag
                    basePrice={productData.price}
                    userCurrency={Currency}
                    symbol={Symbol}
                  />
                )}
              </span>
              {saveOffer(productData.price, productData.originalPrice) && (
                <>
                  <span className="text-xl text-n-muted_foreground line-through">
                    {Currency === "USD" ? (
                      <>
                        {productData.originalPrice}
                        {Symbol}
                      </>
                    ) : (
                      <PriceTag
                        basePrice={productData.originalPrice}
                        userCurrency={Currency}
                        symbol={Symbol}
                      />
                    )}
                  </span>
                  <Badge variant="destructive">
                    {Currency === "USD" ? (
                      <>
                        Save {Symbol}
                        {productData.originalPrice - productData.price}
                      </>
                    ) : (
                      <>
                        Save {Symbol}
                        <PriceTag
                          basePrice={
                            productData.originalPrice - productData.price
                          }
                          userCurrency={Currency}
                        />
                      </>
                    )}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-n-muted_foreground text-lg leading-relaxed">
              {productData.description}
            </p>

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

            {/* Cart Actions */}
            <div className="flex items-center gap-3">
              {isSignedIn ? (
                !cartProduct ? (
                  <Button
                    className="flex-1"
                    onClick={() => addToCart(productData.id)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </Button>
                ) : (
                  <>
                    <div className="flex items-center border rounded min-w-[120px] py-2 px-2 justify-between">
                      <button
                        onClick={() =>
                          updateCartQuantity(cartProduct.id, cartQuantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{cartQuantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(cartProduct.id, cartQuantity + 1)
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
                  onClick={() => addToLocalCart(productData.id)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              ) : (
                <>
                  <div className="flex items-center border rounded min-w-[120px] py-2 px-2 justify-between">
                    <button onClick={() => removeFromLocalCart(productData.id)}>
                      -
                    </button>
                    <span>{localCartQuantity}</span>
                    <button onClick={() => addToLocalCart(productData.id)}>
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
              {Object.entries(productData.specifications || {}).map(
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
