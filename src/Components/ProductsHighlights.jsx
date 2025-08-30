import {
  Star,
  Heart,
  ShoppingCart,
  RefreshCcw,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/Context/AppContext";
import { useEffect, useState } from "react";
import { Loading, LottieLoading } from "./Loading";
import PriceTag from "./PriceTag";

const ProductHighlights = () => {
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
    loading,
    setLoading,
  } = useAppContext();

  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [products]);

  const saveOffer = (price, originalPrice) => {
    if (originalPrice - price > 0) {
      return true;
    }
  };

  return (
    <section className="py-24 bg-n-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-n-foreground mb-4">
            Best Selling
            <span className="text-gradient"> Luminaires</span>
          </h2>
          <p className="text-lg text-n-muted_foreground max-w-2xl mx-auto">
            Handpicked favorites loved by thousands of customers for their
            exceptional design and performance.
          </p>
        </div>
        {loading ? (
          <>
            <div className="relative text-center py-8 min-h-[300px]">
              <Loader2 className="h-10 w-10 mx-auto animate-spin mb-4 text-orange-500" />
              <p className="text-orange-500 text-sm font-bold">
                Loading Products...
              </p>

              {/* <LottieLoading
                className={"min-h-[300px] z-20"}
                className2={"!top-1/2 !left-1/2"}
              /> */}
            </div>
          </>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px]">
              {products.map((product, index) => {
                const cartProduct = cartItems.find(
                  (item) => item.id === product.id
                );
                const cartQuantity = cartProduct?.quantity || 0;
                const localCartProduct = localCart.find(
                  (item) => item.id === product.id
                );
                const localCartQuantity = localCartProduct?.quantity || 0;
                return (
                  <Card
                    key={index}
                    className="card-lumira hover-lift group cursor-pointer"
                    onClick={() => {
                      router.push(`/product/${product.id}`);
                    }}
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
                          className="absolute top-3 right-3 bg-n-background/80 hover:bg-n-background opacity-0 group-hover:opacity-100 transition-opacity"
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
                                  basePrice={
                                    product.originalPrice - product.price
                                  }
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
                            {product.price}${/* {Currency} */}
                          </span>
                          {product.originalPrice != "0000" && (
                            <span className="text-sm text-n-muted_foreground line-through">
                              {product.originalPrice}$
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          className="w-full"
                          variant="coral"
                          onClick={() => router.push(`/product/${product.id}`)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" /> Explore
                          Product
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/all-products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
