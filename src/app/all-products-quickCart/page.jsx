"use client";
import ProductCard from "../../Components/ProductCard";
import Navbar from "../../components/Navbar";
import Footer from "../../Components/Footer";
import { useAppContext } from "../../Context/AppContext";
import DefaultStyler from "@/Components/DefaultStyler";
import FooterOne from "../../Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import { useEffect, useState } from "react";
import { Loading, LottieLoading } from "@/Components/Loading";

const AllProducts = ({ hidden }) => {
  const { products } = useAppContext();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (products === undefined || products === null) {
      setloading(true);
    } else {
      setloading(false);
    }
  }, [products]);

  if (loading) return <LottieLoading />;
  return (
    <>
      <Navbar relative hidden={hidden} />
      <DefaultStyler>
        <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-[50rem]">
          <div className="flex flex-col items-end pt-12">
            <p className="text-2xl font-medium">All products</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
            {Array.isArray(products) &&
              products.map((item, index) => (
                <ProductCard key={index} product={item} />
              ))}
          </div>
        </div>

        <FooterOne crosses hidden={hidden} />

        <FooterTwo crosses hidden={hidden} />
      </DefaultStyler>
    </>
  );
};

export default AllProducts;
