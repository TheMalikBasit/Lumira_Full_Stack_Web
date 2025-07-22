"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/Context/AppContext";
import Navbar from "../../../components/Navbar";
import Footer from "@/Components/LumiraFooter";
import { Loading, LottieLoading } from "@/Components/Loading";
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
    currency,
    router,
    loading,
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    deleteFromLocalCart,
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

  const cartProduct = cartItems.find((item) => item.itemId === id);
  const cartQuantity = cartProduct?.quantity || 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productData.imageUrl.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + productData.imageUrl.length) % productData.imageUrl.length
    );
  };

  const localCartProduct = localCart.find((item) => item.id === id);
  const localCartQuantity = localCartProduct?.quantity || 0;

  console.log("Local cart product:", localCartProduct);
  const saveOffer = (price, originalPrice) => {
    if (originalPrice - price > 0) {
      return true;
    }
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
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-n-muted_foreground hover:text-n-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-n-secondary/20 group">
              <Image
                src={
                  productData.imageUrl[currentImageIndex] ||
                  productData.mainImage
                }
                alt={`${productData.name}`}
                width={720}
                height={720}
                className="w-full h-full object-cover"
              />
              {productData.imageUrl.length > 1 && (
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
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[productData.mainImage, ...productData.imageUrl].map(
                (img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
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
                )
              )}
            </div>
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
                {currency}
                {productData.price}
              </span>
              {/* {productData.originalPrice && (
                <>
                  <span className="text-xl text-n-muted_foreground line-through">
                    {currency}
                    {productData.originalPrice}
                  </span>
                  <Badge variant="destructive">
                    Save {currency}
                    {productData.originalPrice - productData.price}
                  </Badge>
                </>
              )} */}
              {saveOffer(productData.price, productData.originalPrice) && (
                <>
                  <span className="text-xl text-n-muted_foreground line-through">
                    {currency}
                    {productData.originalPrice}
                  </span>
                  <Badge variant="destructive">
                    Save {currency}
                    {productData.originalPrice - productData.price}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-n-muted_foreground text-lg leading-relaxed">
              {productData.description}
            </p>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-n-foreground mb-2">
                Key Features:
              </h3>
              <div className="grid grid-cols-1 gap-1">
                {/* {productData.features?.map((feature, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))} */}
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-n-muted_foreground">
                    <Badge variant="secondary" className="text-xs">
                      {productData.features}
                    </Badge>
                  </span>
                </div>
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
                          updateCartQuantity(
                            cartProduct.itemId,
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
                            cartProduct.itemId,
                            cartQuantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <Button
                      className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
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
                    className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 pb-14">
            {products.slice(0, 5).map((product, index) => (
              <Card key={index} className="card-lumira hover-lift group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || product.mainImage}
                      alt={product.name}
                      width={320}
                      height={320}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-n-primary text-n-primary_foreground">
                        {product.badge}
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge
                        variant="destructive"
                        className="absolute bottom-3 left-3 bg-n-lumira_coral text-white"
                      >
                        Save {currency}
                        {product.originalPrice - product.price}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-n-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-n-muted_foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-n-foreground">
                        {currency}
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-n-muted_foreground line-through">
                          {currency}
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button className="w-full" variant="coral">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" variant="outline" className="min-w-[200px] mb-12">
              See More
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
