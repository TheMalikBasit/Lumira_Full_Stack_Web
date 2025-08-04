"use client";

import React, { useEffect, useState } from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/Context/AppContext";
import { Loading, LottieLoading } from "./Loading";
import { useUser } from "@clerk/nextjs";
import PriceTag from "./PriceTag";

const FeaturedProducts = ({ id }) => {
  const {
    products,
    router,
    Currency,
    Symbol,
    addToCart,
    updateCartQuantity,
    localCart,
    cartItems,
    addToLocalCart,
    removeFromLocalCart,
  } = useAppContext();

  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [products]);

  if (loading) return <LottieLoading />;

  const saveOffer = (price, originalPrice) => {
    return originalPrice - price > 0;
  };

  const filteredProducts = products.filter(
    (prod) =>
      Array.isArray(prod.badges) && prod?.badges?.length > 0 && prod.id !== id
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product, index) => {
        const cartProduct = cartItems.find((item) => item.id === product.id);
        const cartQuantity = cartProduct?.quantity || 0;
        const localCartProduct = localCart.find(
          (item) => item.id === product.id
        );
        const localCartQuantity = localCartProduct?.quantity || 0;
        return (
          <Card
            key={index}
            className="card-lumira hover-lift group cursor-pointer"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badge */}
                <div className="absolute top-3 left-3 w-full">
                  {(product.badges || []).map((badge, index) => (
                    <Badge
                      key={index}
                      className="mr-1 bg-n-primary text-n-primary_foreground"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Wishlist Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Sale Badge */}
                {saveOffer(product.price, product.originalPrice) && (
                  <Badge
                    variant="destructive"
                    className="absolute bottom-3 left-3 bg-n-lumira_coral text-white"
                  >
                    {Currency === "USD" ? (
                      <>
                        Save {Symbol}
                        {product.originalPrice - product.price}
                      </>
                    ) : (
                      <>
                        Save {Symbol}
                        <PriceTag
                          basePrice={product.originalPrice - product.price}
                          userCurrency={Currency}
                        />
                      </>
                    )}
                  </Badge>
                )}
              </div>

              <div className="p-4">
                {/* Product Name */}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(product.features || [])
                    .slice(0, 2)
                    .map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-n-foreground">
                    {Currency === "USD" ? (
                      <>
                        {product.price}
                        {Symbol}
                      </>
                    ) : (
                      <PriceTag
                        basePrice={product.price}
                        userCurrency={Currency}
                        symbol={Symbol}
                      />
                    )}
                    {/* {Currency} */}
                  </span>
                  {product.originalPrice != product.price && (
                    <span className="text-sm text-n-muted_foreground line-through">
                      {Currency === "USD" ? (
                        <>
                          {product.originalPrice}
                          {Symbol}
                        </>
                      ) : (
                        <PriceTag
                          basePrice={product.originalPrice}
                          userCurrency={Currency}
                          symbol={Symbol}
                        />
                      )}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-3"
                >
                  {isSignedIn ? (
                    !cartProduct ? (
                      <Button
                        className="w-full"
                        variant="coral"
                        onClick={() => addToCart(product.id)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                    ) : (
                      <>
                        <div className="flex items-center border rounded min-w-[120px] py-2 px-2 justify-between">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                cartProduct.id,
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
                                cartProduct.id,
                                cartQuantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <Button
                          // className="w-full" variant="coral"
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
                      onClick={() => addToLocalCart(product.id)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  ) : (
                    <>
                      <div className="flex items-center border rounded min-w-[120px] py-2 px-2 justify-between">
                        <button onClick={() => removeFromLocalCart(product.id)}>
                          -
                        </button>
                        <span>{localCartQuantity}</span>
                        <button onClick={() => addToLocalCart(product.id)}>
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
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;
