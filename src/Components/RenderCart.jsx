"use client";
import React, { useEffect } from "react";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import { LoadingDiv, LottieLoading } from "@/Components/Loading";
import Image from "next/image";
import { Card, CardContent } from "@/Components/UI/card";
import { Button } from "@/Components/UI/lumiraButton";
import { Trash2, Minus, Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import toast from "react-hot-toast";
const RenderCart = () => {
  const {
    products,
    cartItems,
    updateCartQuantity,
    currency,
    router,
    loading,
    setLoading,
    darkMode,
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    deleteFromLocalCart,
    toggleItemChecked,
    toggleLocalItemCheck,
  } = useAppContext();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      if (cartItems === undefined || cartItems === null) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    document.body.style.backgroundColor = darkMode ? "#000000" : "#FFFFF4";
  }, [cartItems, isSignedIn, localCart]);

  if (loading) return <LottieLoading />;

  // ✅ Only the updated portion of renderProductCard is shown
  const renderProductCard = (item, product, isLocal = false) => {
    const quantity = item.quantity;
    const handleDecrease = () =>
      isLocal
        ? removeFromLocalCart(item.id)
        : updateCartQuantity(item.id, quantity - 1);
    const handleIncrease = () => {
      if (product.availableStock > 0) {
        isLocal
          ? addToLocalCart(item.id)
          : updateCartQuantity(item.id, quantity + 1);
      } else {
        toast.error("Item out of stock");
      }
    };
    const handleRemove = () =>
      isLocal ? deleteFromLocalCart(item.id) : updateCartQuantity(item.id, 0);
    const toggleCheck = () =>
      isLocal ? toggleLocalItemCheck(item.id) : toggleItemChecked(item.id);

    const id = isLocal ? item.id : item.id;
    const features = product.features?.slice(0, 2) || [];

    const isInStock = product.availableStock > 0;
    console.log("From RenderCart inStock: ", isInStock);
    return (
      <Card
        key={id}
        className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-200 hover-lift animate-fade-in relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon" />
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* ✅ Checkbox to left */}
            <div className="flex items-start justify-center sm:items-center sm:flex-col gap-4">
              <FontAwesomeIcon
                icon={item.checked ? faCheckSquare : faSquare}
                onClick={toggleCheck}
                className="text-2xl cursor-pointer sm:mb-8"
              />
            </div>

            {/* ✅ Product Image */}
            <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-n-muted to-n-muted/50 shadow-warm group/image">
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover/image:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
            </div>

            {/* ✅ Main content */}
            <div className="flex-1 space-y-4">
              <h3
                className="font-bold text-n-foreground text-2xl mb-2 transition-all duration-300 cursor-pointer"
                onClick={() => router.push("/product/" + product.id)}
              >
                {product.name}
              </h3>

              {/* ✅ Features and Stock */}
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                {features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-n-primary/20 to-n-primary/10 text-n-primary border border-n-primary/20"
                  >
                    {feature}
                  </span>
                ))}
                {/* ✅ In Stock / Out of Stock Badge */}
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
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-n-foreground">
                    {currency} {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-n-muted_foreground">per item</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-n-primary/5 to-n-lumira_coral/5 border border-n-primary/10">
                  <p className="text-sm font-medium text-n-foreground">
                    Subtotal:{" "}
                    <span className="text-lg text-n-foreground font-bold">
                      {currency} {(product.price * quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Remove + Quantity Buttons */}
            <div className="flex flex-col sm:items-end gap-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="self-end text-n-destructive hover:text-n-destructive hover:bg-n-destructive/10 hover-scale hover:shadow-warm transition-all duration-300"
              >
                <Trash2 className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-4 bg-gradient-to-r from-n-muted/50 to-n-muted/30 rounded-2xl p-4 backdrop-blur-sm border border-n-border/50">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrease}
                  className="h-12 w-12 hover-scale shadow-sm hover:shadow-warm transition-all duration-300 border-n-primary/20 hover:border-n-primary/40"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-xs text-n-muted_foreground font-medium">
                    QTY
                  </span>
                  <span className="text-2xl font-bold text-n-foreground">
                    {isInStock ? quantity : 0}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrease}
                  className="h-12 w-12 hover-scale shadow-sm hover:shadow-warm transition-all duration-300 border-n-primary/20 hover:border-n-primary/40"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const cartToRender = isSignedIn ? cartItems : localCart;
  const isEmpty = !cartToRender || cartToRender.length === 0;

  return (
    <div className="lg:col-span-2 space-y-8">
      {isEmpty ? (
        <p
          className={`font-poppins text-2xl ${
            darkMode ? "text-white" : "text-black"
          } underline cursor-pointer ml-10`}
        >
          Your cart is empty.
        </p>
      ) : (
        cartToRender.map((item) => {
          const product = products.find(
            (p) => p.id === (isSignedIn ? item.id : item.id)
          );
          if (!product) return null;
          return renderProductCard(item, product, !isSignedIn);
        })
      )}
    </div>
  );
};

export default RenderCart;
