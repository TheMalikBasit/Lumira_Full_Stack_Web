import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/Context/AppContext";
const products = [
  {
    id: 1,
    name: "Aurora Desk Lamp",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviews: 124,
    image: assets.studyLamp,
    badge: "Best Seller",
    features: ["LED", "Adjustable", "USB Charging"],
  },
  {
    id: 2,
    name: "Zen Floor Lamp",
    price: 299,
    rating: 4.9,
    reviews: 89,
    image: assets.floorLamp,
    badge: "New",
    features: ["Warm Light", "Dimmable", "Remote Control"],
  },
  {
    id: 3,
    name: "Cosmos Pendant Light",
    price: 249,
    rating: 4.7,
    reviews: 156,
    image: assets.pendantLamp,
    features: ["Modern Design", "Easy Install", "Energy Efficient"],
  },
  {
    id: 4,
    name: "Lumina Pro Desk Lamp",
    price: 199,
    rating: 4.9,
    reviews: 203,
    image: assets.heroLamp,
    badge: "Editor's Choice",
    features: ["Premium Build", "Touch Control", "Multiple Modes"],
  },
];

const ProductHighlights = () => {
  const { router } = useAppContext();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Best Selling
            <span className="text-gradient"> Luminaires</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked favorites loved by thousands of customers for their
            exceptional design and performance.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="card-lumira hover-lift group">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {product.badge}
                    </Badge>
                  )}

                  {/* Wishlist Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>

                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <Badge
                      variant="destructive"
                      className="absolute bottom-3 left-3 bg-lumira-coral text-white"
                    >
                      Save ${product.originalPrice - product.price}
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
                    {product.features.slice(0, 2).map((feature, index) => (
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
                    <span className="text-lg font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button className="w-full" variant="coral">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
