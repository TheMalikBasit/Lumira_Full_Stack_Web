import { ArrowRight } from "lucide-react";
import { assets } from "@/assets/assets";
import { Card, CardContent } from "@/Components/UI/card";
import { Button } from "@/Components/UI/lumiraButton";
import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Study Lamps",
    description: "Perfect lighting for productivity and focus",
    image: assets.studyLamp,
    count: "45+ designs",
  },
  {
    id: 2,
    name: "Floor Lamps",
    description: "Elegant ambient lighting for any room",
    image: assets.floorLamp,
    count: "38+ designs",
  },
  {
    id: 3,
    name: "Pendant Lights",
    description: "Statement pieces that transform spaces",
    image: assets.pendantLamp,
    count: "52+ designs",
  },
];

const Collections = () => {
  return (
    <section id="collections" className="py-24 bg-n-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-n-foreground mb-4">
            Explore Our
            <span className="text-n-spaceGradient"> Collections</span>
          </h2>
          <p className="text-lg text-n-muted_foreground max-w-2xl mx-auto">
            From focused task lighting to ambient mood setters, discover the
            perfect lamp for every corner of your life.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="card-lumira hover-lift group cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  {/* <img
                    src={assets.pendantLamp}
                    alt={category.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  /> */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-n-accent text-n-accent_foreground px-3 py-1 rounded-full text-sm font-medium">
                      {category.count}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-n-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-n-muted_foreground mb-4">
                    {category.description}
                  </p>
                  <Button variant="ghost" className="group p-0 h-auto">
                    View Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" variant="coral">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Collections;
