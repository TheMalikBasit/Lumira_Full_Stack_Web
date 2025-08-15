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
import { Currency, ShoppingBag } from "lucide-react";
import { Separator } from "@/Components/UI/separator";
import Link from "next/link";
import { LottieLoading } from "./Loading";
import PriceTag from "./PriceTag";
const OrderSummaryClassic = () => {
  const {
    getCartAmount,
    Currency,
    darkMode,
    getLocalCartAmount,
    products,
    Symbol,
    cartItems,
    localCart,
    loading,
  } = useAppContext();
  const { isSignedIn } = useUser();

  //   const [shipmentCharges, setshipmentCharges] = useState(0);
  // useEffect(() => {
  //   if (getCartAmount() > 0 || getLocalCartAmount() > 0) {
  //     setshipmentCharges(200);
  //   } else {
  //     setshipmentCharges(0);
  //   }
  // }, [getCartAmount, getLocalCartAmount, products]);

  const currentCart = isSignedIn ? cartItems : localCart;
  const checkedItems = currentCart.filter((item) => item.checked);

  const orderItems = checkedItems
    .map((item) => products.find((product) => product.id === item.id))
    .filter(Boolean);

  const fetchQuantity = (id) => {
    const item = currentCart.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * fetchQuantity(item.id),
    0
  );
  // const tax = subtotal * 0.02;
  const total = subtotal;

  console.log("Currency from summary: ", Currency);
  console.log("getLocalCartAmount from summary: ", getLocalCartAmount);
  console.log("getCartAmount from summary: ", getCartAmount);
  return (
    <Card
      className="border-n-border/50 shadow-elegant hover:shadow-glow transition-all duration-200 backdrop-blur-sm bg-n-card/90 overflow-hidden group animate-fade-in"
      style={{ animationDelay: "600ms" }}
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-n-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

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
                      basePrice={subtotal.toFixed(2)}
                      userCurrency={Currency}
                      symbol={Symbol}
                    />
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                <span className="text-n-muted_foreground font-medium">
                  Shipping
                </span>

                <span className="text-xs text-emerald-700 py-1 text-end">
                  Depends on Shipment Location
                </span>
              </div>
              {/* <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
            <span className="text-n-muted_foreground font-medium">
              Tax <span className="text-orange-500">(2%)</span>
            </span>
            <span className="text-n-foreground font-bold text-lg">
              {currency}
              {tax.toFixed(2)}
            </span>
          </div> */}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-n-primary/10 via-n-lumira_coral/5 to-n-lumira_salmon/10 border border-n-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-n-primary/5 to-transparent animate-pulse"></div>
              <div className="relative z-10">
                <span className="text-n-foreground font-bold text-xl">
                  Total
                </span>
                <p className="text-xs text-n-muted_foreground">
                  including all taxes
                </p>
              </div>
              <span className="text-n-foreground font-bold text-3xl relative z-10">
                {Currency === "USD" ? (
                  <>
                    {total.toFixed(2)} {Symbol}
                  </>
                ) : (
                  <PriceTag
                    basePrice={total.toFixed(2)}
                    userCurrency={Currency}
                    symbol={Symbol}
                  />
                )}
              </span>
            </div>

            {/* {subtotal < 200 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-n-lumira_coral/10 to-n-lumira_salmon/10 border border-n-lumira_coral/30 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-n-lumira_coral/5 to-transparent"></div>
            <div className="relative z-10">
              <p className="text-sm text-n-lumira_coral font-bold mb-1">
                🔥 Almost there!
              </p>
              <p className="text-xs text-n-muted_foreground">
                Add{" "}
                <span className="font-bold text-n-lumira_coral">
                  {(200 - subtotal).toFixed(2)} {Symbol}
                </span>{" "}
                more for free shipping
              </p>
            </div>
          </div>
        )} */}
          </CardContent>
        </>
      )}
      <CardFooter className="flex flex-col gap-5 p-8 pt-0">
        <Link href="/my-checkout" className="w-full">
          <Button className="w-full bg-gradient-warm hover:shadow-glow transition-all duration-200 text-lg py-8 rounded-xl font-bold tracking-wide hover-lift relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">Proceed to Checkout</span>
          </Button>
        </Link>
        <Link href="/all-products" className="w-full">
          <Button
            variant="outline"
            className="w-full hover-scale py-4 rounded-xl border-n-primary/20 hover:border-n-primary/40 hover:bg-n-primary/5 transition-all duration-300"
          >
            Continue Shopping
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OrderSummaryClassic;
