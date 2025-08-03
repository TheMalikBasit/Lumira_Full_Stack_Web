"use client";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/LumiraFooter";
import { useAppContext } from "@/Context/AppContext";
import { useEffect, useState } from "react";
import { Loading, LottieLoading } from "@/Components/Loading";
import Image from "next/image";
// UI components from File 2
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  SortDesc,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import { Input } from "@/Components/UI/input";
import PriceTag from "@/Components/PriceTag";
const AllProducts = ({ hidden }) => {
  const { products, router, Symbol, Currency } = useAppContext();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setloading(true);
    } else {
      setloading(false);
    }
  }, [products]);

  if (loading) return <LottieLoading />;

  const saveOffer = (price, originalPrice) => {
    if (originalPrice - price > 0) {
      return true;
    }
  };
  return (
    <div className="min-h-screen bg-n-background">
      <Navbar relative hidden={hidden} />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero border-b border-n-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-n-foreground mb-6">
            Our Complete{" "}
            <span className="text-n-spaceGradient"> Collection</span>
          </h1>
          <p className="text-lg sm:text-xl text-n-muted_foreground max-w-3xl mx-auto mb-8">
            Discover our full range of premium lighting solutions designed to
            illuminate and enhance your space with style and functionality.
          </p>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-background border-b border-n-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-1/3">
            <Input
              placeholder="Search products..."
              className="bg-n-muted/50 border-n-border focus:border-n-primary"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortDesc className="mr-2 h-4 w-4" />
              Sort
            </Button>
            <div className="flex items-center border border-border rounded-md">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-l-none border-l border-border"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-n-foreground">
              All Products{" "}
              <span className="text-n-muted_foreground">
                ({products.length} items)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card
                key={index}
                className="card-lumira hover-lift group cursor-pointer"
                onClick={() => {
                  router.push("/product/" + product.id);
                }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {/* <div className="cursor-pointer overflow-hidden group relative bg-gray-500/10 rounded-t-lg w-full"> */}
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      width={800}
                      height={800}
                      className="w-full object-cover h-48 transition-transform duration-500 group-hover:scale-110"
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
                      {/* <Badge variant="secondary" className="text-xs">
                        {product.features}
                      </Badge> */}
                    </div>

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

                    <Button className="w-full" variant="coral">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllProducts;
