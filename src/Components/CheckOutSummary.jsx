import React, { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { ArrowLeft, CreditCard, Lock, MapPin, User } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { LottieLoading } from "./Loading";
import { Separator } from "@/Components/UI/separator";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Image from "next/image";
const CheckOutSummary = ({
  shipmentCharge,
  totalCharged,
  selectedShippingData,
}) => {
  const { user, isSignedIn } = useUser();
  const { router, products, cartItems, localCart, loading, setLoading } =
    useAppContext();

  const currentCart = isSignedIn ? cartItems : localCart;
  const checkedItems = currentCart.filter((item) => item.checked);

  const orderItems = checkedItems
    .map((item) => products.find((product) => product.id === item.id))
    .filter(Boolean);

  const fetchQuantity = (id) => {
    const item = currentCart.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  console.log("From checkout order summary orderItems: ", orderItems);

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * fetchQuantity(item.id),
    0
  );
  // const tax = subtotal * 0.02;
  const total = subtotal + shipmentCharge;

  useEffect(() => {
    totalCharged(total);
  }, [subtotal, total, shipmentCharge]);
  console.log("Shipment data test", selectedShippingData);
  return (
    <>
      <div className="lg:sticky lg:top-8 lg:h-fit">
        <Card
          className="border-n-border/50 backdrop-blur-sm bg-n-card/90 hover:shadow-elegant transition-all duration-500 shadow-warm animate-fade-in relative overflow-hidden group"
          style={{ animationDelay: "600ms" }}
        >
          {/* Card decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-n-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <CardHeader className="bg-gradient-to-r from-n-primary/10 via-n-primary/5 to-n-lumira_coral/10 relative">
            <CardTitle className="text-n-foreground text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-n-primary/20">
                <CreditCard className="h-6 w-6 text-n-primary" />
              </div>
              Order Summary
            </CardTitle>
          </CardHeader>
          {loading ? (
            <div className="flex min-h-screen justify-center py-8">
              <LottieLoading />
            </div>
          ) : (
            <CardContent className="space-y-6 p-8">
              {/* Order Items */}
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent hover:from-n-muted/50 transition-all duration-300 group/item animate-fade-in"
                    style={{ animationDelay: `${700 + index * 100}ms` }}
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-n-muted to-n-muted/50 shadow-warm flex-shrink-0 group-hover/item:shadow-glow transition-shadow duration-300">
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-n-foreground text-base mb-1 group-hover/item:bg-text-gradient group-hover/item:bg-clip-text group-hover/item:text-transparent transition-all duration-300">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-3 mb-2">
                        {(item.features?.slice(0, 2) || []).map(
                          (feature, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-n-primary/20 to-n-primary/10 text-n-primary border border-n-primary/20"
                            >
                              {feature}
                            </span>
                          )
                        )}
                        <span className="text-xs text-n-muted_foreground">
                          Qty: {fetchQuantity(item.id) || 0}
                        </span>
                      </div>
                      <div className="text-lg font-bold bg-text-gradient bg-clip-text text-transparent">
                        RS{(item.price * fetchQuantity(item.id)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cursor-pointer">
                <p className="text-md text-green-700 underline">ReturnPolicy</p>
              </div>
              <Separator className="my-6" />
              {/* Price Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                  <span className="text-n-muted_foreground font-medium">
                    Subtotal
                  </span>
                  <span className="text-n-foreground font-bold text-lg">
                    RS{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                  {shipmentCharge != 0 ? (
                    <span className="text-n-muted_foreground font-medium">
                      Shipping
                    </span>
                  ) : (
                    <></>
                  )}
                  <span className={`font-bold text-lg "text-emerald-600"}`}>
                    {shipmentCharge === null ? (
                      <span className="flex items-center gap-2">
                        <span className="text-center text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">
                          Select an address first or add a new one.
                        </span>
                      </span>
                    ) : shipmentCharge === 0 ? (
                      <span className="flex items-center">
                        <span className="text-center text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">
                          Please note that international shipping rates may be
                          higher due to the fragile nature of the items, which
                          require premium handling and packaging. You will pay
                          additional shipment ammout that DHL provide you with a
                          detailed breakdown of the shipping charges applicable
                          to your order.
                        </span>
                      </span>
                    ) : (
                      `RS${shipmentCharge}`
                    )}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                  <span className="text-n-muted_foreground font-medium">
                    Tax
                  </span>
                  <span className="text-n-foreground font-bold text-lg">
                    ${tax.toFixed(2)}
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
                <span className="bg-text-gradient bg-clip-text text-transparent font-bold text-3xl relative z-10">
                  RS{total.toFixed(2)}
                </span>
              </div>

              {/* Enhanced Security Notice */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-green-50/50 border border-emerald-200/50 relative overflow-hidden animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-transparent animate-pulse"></div>
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Lock className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-emerald-800">
                    256-bit SSL Encryption
                  </p>
                  <p className="text-xs text-emerald-600">
                    Your payment information is secure and protected
                  </p>
                </div>
              </div>
              {!user ? (
                <>
                  <Button
                    data-tooltip-id="incomplete-info-tooltip"
                    data-tooltip-content="Login to complete your checkout"
                    className="cursor-default opacity-25 w-full bg-gradient-warm hover:shadow-glow transition-all duration-500 text-lg py-8 rounded-xl font-bold tracking-wide hover-lift relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Lock className="h-5 w-5" />
                      Complete Secure Order
                    </span>
                  </Button>
                  <Tooltip id="incomplete-info-tooltip" />
                </>
              ) : Object.keys(selectedShippingData).length === 0 ? (
                <>
                  {" "}
                  <>
                    <Button
                      data-tooltip-id="incomplete-info-tooltip"
                      data-tooltip-content="Select Shipment Address Or Add New One"
                      className="cursor-default opacity-25 w-full bg-gradient-warm hover:shadow-glow transition-all duration-500 text-lg py-8 rounded-xl font-bold tracking-wide hover-lift relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <Lock className="h-5 w-5" />
                        Complete Secure Order
                      </span>
                    </Button>
                    <Tooltip id="incomplete-info-tooltip" />
                  </>
                </>
              ) : (
                <>
                  <Button className="w-full bg-gradient-warm hover:shadow-glow transition-all duration-500 text-lg py-8 rounded-xl font-bold tracking-wide hover-lift relative overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Lock className="h-5 w-5" />
                      Complete Secure Order
                    </span>
                  </Button>
                </>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default CheckOutSummary;
