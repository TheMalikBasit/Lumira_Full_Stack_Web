"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import { LottieLoading } from "@/Components/Loading";
import Image from "next/image";
import { Card, CardContent } from "@/Components/UI/card";
import { Button } from "@/Components/UI/lumiraButton";
import { Trash2, Minus, Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import toast from "react-hot-toast";
import PriceTag from "./PriceTag";
import { db } from "../../Config/firebase";
import { collection, getDocs } from "firebase/firestore";

const CartProductCard = ({ item, product, isLocal }) => {
  const {
    updateCartQuantity,
    addToLocalCart,
    removeFromLocalCart,
    deleteFromLocalCart,
    toggleItemChecked,
    toggleLocalItemCheck,
    Currency,
    Symbol,
    router,
  } = useAppContext();

  const [selectedVariant, setSelectedVariant] = useState(null);

  const pid = item.id; // product id
  const vid = item.vid; // variant id
  const quantity = item.quantity;

  useEffect(() => {
    if (!pid || !vid) return;
    const fetchVariants = async () => {
      try {
        const variantsRef = collection(db, "products", pid, "variants");
        const snapshot = await getDocs(variantsRef);
        const variantsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const variant = variantsData.find((v) => v.id === vid);
        if (variant) setSelectedVariant(variant);
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    };
    fetchVariants();
  }, [pid, vid]);

  // Handlers
  const handleDecrease = () =>
    isLocal ? removeFromLocalCart(vid) : updateCartQuantity(vid, quantity - 1);

  const handleIncrease = () => {
    const stock = selectedVariant?.availableStock ?? product.availableStock;
    if (stock > quantity) {
      isLocal ? addToLocalCart(vid) : updateCartQuantity(vid, quantity + 1);
    } else {
      toast.error("Item out of stock");
    }
  };

  const handleRemove = () =>
    isLocal ? deleteFromLocalCart(vid) : updateCartQuantity(vid, 0);

  const toggleCheck = () =>
    isLocal ? toggleLocalItemCheck(vid) : toggleItemChecked(vid, pid);

  const isInStock =
    (selectedVariant?.availableStock ?? product.availableStock) > 0;
  const features = product.features?.slice(0, 2) || [];
  return (
    <Card className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon" />
      <CardContent className="p-8">
        <div className="flex flex-col sm:flex-row gap-8 sm:items-center">
          {/* Checkbox */}
          <div className="flex justify-center items-center sm:flex-col gap-4">
            <FontAwesomeIcon
              icon={item.checked ? faCheckSquare : faSquare}
              onClick={toggleCheck}
              className="text-2xl cursor-pointer sm:mb-8"
            />
          </div>

          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-n-muted to-n-muted/50 shadow-warm">
            <img
              src={selectedVariant?.cjImage}
              alt={"VariantImage"}
              className="object-cover h-full w-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <h3
              className="font-bold text-n-foreground text-2xl cursor-pointer"
              onClick={() => router.push("/product/" + product.id)}
            >
              {/* {product.name} */}
              {selectedVariant?.cjKey}
              <span
                className={`inline-flex items-center px-3 gap-2 py-1.5 rounded-full font-medium text-sm ${
                  isInStock ? "text-emerald-600" : "text-red-800"
                }`}
              >
                <div
                  className={`w-2 h-2 ${
                    isInStock ? "bg-emerald-500" : "bg-red-500"
                  } rounded-full animate-pulse`}
                ></div>
                {isInStock ? "In Stock" : "Out of Stock"}
              </span>
            </h3>

            {/* Features + Stock */}
            <div className="hidden md:flex items-center gap-4 flex-wrap">
              {features.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold bg-n-primary/10 text-n-primary"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Price + Subtotal */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-n-foreground">
                  {Currency === "USD" ? (
                    <>
                      {selectedVariant?.lumiraPrice}
                      {Symbol}
                    </>
                  ) : (
                    <>
                      <PriceTag
                        basePrice={selectedVariant?.lumiraPrice}
                        userCurrency={Currency}
                        symbol={Symbol}
                      />
                    </>
                  )}
                </span>
                <p className="text-sm text-n-muted_foreground">per item</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="gap-4 p-4 flex items-center rounded-xl bg-gradient-to-r from-n-primary/5 to-n-lumira_coral/5 border border-n-primary/10">
                  <p className="text-sm font-medium text-n-foreground">
                    Subtotal:{" "}
                  </p>
                  <span className="text-lg text-n-foreground font-bold">
                    {Currency === "USD" ? (
                      <>
                        {selectedVariant?.lumiraPrice * quantity}
                        {Symbol}
                      </>
                    ) : (
                      <PriceTag
                        basePrice={selectedVariant?.lumiraPrice * quantity}
                        userCurrency={Currency}
                        symbol={Symbol}
                      />
                    )}
                    {/* {Currency} */}
                  </span>
                </div>
                <div className="flex flex-row items-center space-x-3">
                  <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-n-muted/30 border w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDecrease}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="text-2xl font-bold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleIncrease}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemove}>
                    <Trash2 className="h-10 w-10 text-n-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RenderCart = () => {
  const { products, cartItems, localCart, loading, darkMode } = useAppContext();
  const { isSignedIn } = useUser();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#000" : "#FFFFF4";
  }, [darkMode]);

  if (loading) return <LottieLoading />;

  const cartToRender = isSignedIn ? cartItems : localCart;
  if (!cartToRender?.length)
    return <p className="text-2xl ml-10">Your cart is empty.</p>;

  return (
    <div className="lg:col-span-2 space-y-8">
      {cartToRender.map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return null;
        return (
          <CartProductCard
            key={item.vid}
            item={item}
            product={product}
            isLocal={!isSignedIn}
          />
        );
      })}
    </div>
  );
};

export default RenderCart;
