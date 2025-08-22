"use client";
import { useAppContext } from "@/Context/AppContext";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/UI/card";
import { Button } from "@/Components/UI/lumiraButton";
import { ShoppingBag } from "lucide-react";
import { Separator } from "@/Components/UI/separator";
import Link from "next/link";
import { LottieLoading } from "./Loading";
import PriceTag from "./PriceTag";
import { db } from "../../Config/firebase";
import { collection, getDocs } from "firebase/firestore";
const OrderSummaryClassic = () => {
  const {
    Currency,
    darkMode,
    products,
    Symbol,
    cartItems,
    localCart,
    loading,
    router,
  } = useAppContext();
  const { isSignedIn } = useUser();

  const [variantMap, setVariantMap] = useState({}); // { vid: variantData }

  const currentCart = isSignedIn ? cartItems : localCart;
  const checkedItems = currentCart.filter((item) => item.checked);
  // 🔥 Fetch all variants used in cart
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        let allVariants = {};
        for (let item of checkedItems) {
          const pid = item.id; // product id
          const vid = item.vid; // variant id
          if (!pid || !vid) continue;

          // Avoid duplicate fetch
          if (allVariants[vid]) continue;

          const variantsRef = collection(db, "products", pid, "variants");
          const snapshot = await getDocs(variantsRef);
          snapshot.forEach((doc) => {
            allVariants[doc.id] = { id: doc.id, ...doc.data(), pid };
          });
        }
        setVariantMap(allVariants);
      } catch (err) {
        console.error("Error fetching variants for summary:", err);
      }
    };

    console.log("Checked items:", checkedItems);
    if (checkedItems.length > 0) fetchVariants();
  }, [currentCart]);

  // ✅ Subtotal using variant prices
  const subtotal = checkedItems.reduce((sum, item) => {
    const variant = variantMap[item.vid];
    if (!variant) return sum; // still loading
    const price = variant.lumiraPrice ?? variant.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  return (
    <Card className="border-n-border/50 shadow-elegant hover:shadow-glow transition-all duration-200 backdrop-blur-sm bg-n-card/90 overflow-hidden group animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>

      <CardHeader className="bg-gradient-to-r from-n-primary/10 via-n-primary/5 to-n-lumira-coral/10 relative">
        <CardTitle className="text-n-foreground text-2xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-n-primary/20">
            <ShoppingBag className="h-6 w-6 text-n-primary" />
          </div>
          Order Summary
        </CardTitle>
      </CardHeader>

      {loading ? (
        <div className="flex min-h-[400px] justify-center py-8">
          <LottieLoading />
        </div>
      ) : (
        <>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                <span className="text-n-muted_foreground font-medium">
                  Subtotal
                </span>
                <span className="text-n-foreground font-bold text-lg">
                  {Currency === "USD" ? (
                    <>
                      {subtotal.toFixed(2)} {Symbol}
                    </>
                  ) : (
                    <PriceTag
                      basePrice={subtotal}
                      userCurrency={Currency}
                      symbol={Symbol}
                    />
                  )}
                </span>
              </div>

              {/* Shipping Placeholder */}
              <div className="items-center text-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                <span className="text-n-muted_foreground font-medium">
                  View shipping options at checkout
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Total */}
            <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-n-primary/10 via-n-lumira_coral/5 to-n-lumira_salmon/10 border border-n-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-n-primary/5 to-transparent animate-pulse"></div>
              <div className="relative z-10">
                <span className="text-n-foreground font-bold text-xl">
                  Total
                </span>
              </div>
              <span className="text-n-foreground font-bold text-xl md:text-3xl relative z-10">
                {Currency === "USD" ? (
                  <>
                    {total.toFixed(2)} {Symbol}
                  </>
                ) : (
                  <PriceTag
                    basePrice={total}
                    userCurrency={Currency}
                    symbol={Symbol}
                  />
                )}
              </span>
            </div>
          </CardContent>
        </>
      )}

      <CardFooter className="flex flex-col gap-5 p-8 pt-0">
        {checkedItems?.length < 1 ? (
          <>
            <div className="w-full pointer-events-none">
              <Button className="w-full opacity-25 bg-gradient-warm transition-all duration-200 text-lg py-8 rounded-xl font-bold tracking-wide relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Proceed to Checkout</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div onClick={() => router.push("/my-checkout")} className="w-full">
              <Button className="w-full bg-gradient-warm hover:shadow-glow transition-all duration-200 text-lg py-8 rounded-xl font-bold tracking-wide hover-lift relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Proceed to Checkout</span>
              </Button>
            </div>
          </>
        )}

        <div href="/all-products" className="w-full">
          <Button
            variant="outline"
            className="w-full hover-scale py-4 rounded-xl border-n-primary/20 hover:border-n-primary/40 hover:bg-n-primary/5 transition-all duration-300"
          >
            Continue Shopping
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummaryClassic;
