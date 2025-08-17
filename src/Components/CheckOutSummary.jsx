"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { CreditCard, Lock, Repeat } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { LottieLoading } from "./Loading";
import { Separator } from "@/Components/UI/separator";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import PriceTag from "./PriceTag";
import Image from "next/image";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../Config/firebase";
import toast from "react-hot-toast";
import SupportModal from "./SupportModal";

const CheckOutSummary = ({
  shipmentCharge,
  totalCharged,
  selectedShippingData,
  selectedPaymentData,
}) => {
  const { user, isSignedIn } = useUser();
  const {
    router,
    cartItems,
    localCart,
    loading,
    setLoading,
    Symbol,
    Currency,
  } = useAppContext();

  const currentCart = isSignedIn ? cartItems : localCart;
  const checkedItems = currentCart.filter((item) => item.checked);

  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    section: "",
  });

  // ✅ Store fetched variant details
  const [variantMap, setVariantMap] = useState({});

  // 🔥 Fetch variant data for all checked items
  useEffect(() => {
    const fetchVariants = async () => {
      let vMap = {};
      for (let ci of checkedItems) {
        if (!ci.id || !ci.vid) continue;
        try {
          const variantRef = doc(db, "products", ci.id, "variants", ci.vid);
          const snap = await getDoc(variantRef);
          if (snap.exists()) {
            vMap[ci.vid] = { id: ci.vid, ...snap.data() };
          }
        } catch (err) {
          console.error("Error fetching variant", ci.vid, err);
        }
      }
      setVariantMap(vMap);
    };

    if (checkedItems.length > 0) fetchVariants();
  }, [JSON.stringify(checkedItems.map((ci) => ci.vid))]);

  const fetchQuantity = (vid) => {
    const item = currentCart.find((i) => i.vid === vid);
    return item ? item.quantity : 0;
  };

  // ✅ Subtotal using variant prices
  const subtotal = checkedItems.reduce((sum, ci) => {
    const v = variantMap[ci.vid];
    if (!v) return sum;
    const price = v.lumiraPrice ?? v.price ?? 0;
    return sum + price * ci.quantity;
  }, 0);

  const [total, setTotal] = useState(0);
  useEffect(() => {
    const t = subtotal + (shipmentCharge || 0);
    setTotal(t);
    totalCharged(t);
  }, [subtotal, shipmentCharge]);

  // ✅ Checkout Logic
  const handleCheckout = async () => {
    if (!user || !selectedShippingData) {
      toast.error("Missing shipping or user data");
      return;
    }

    if (checkedItems.length === 0) {
      toast.error("No items selected for checkout.");
      return;
    }

    setLoading(true);

    try {
      const itemsToSend = checkedItems.map((ci) => {
        const variant = variantMap[ci.vid];
        if (!variant) throw new Error("Variant not found for checkout.");

        return {
          pid: ci.id,
          vid: ci.vid,
          sku: variant.cjSku,
          ppid: variant.pid,
          vvid: variant.vid,
          quantity: ci.quantity,
          price: Math.round(variant.lumiraPrice ?? variant.price ?? 0),
          name: variant.cjKey ?? variant.cjName,
          image: variant.cjImage,
        };
      });

      const totalAmount = subtotal + shipmentCharge;
      if (selectedPaymentData === "stripe") {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsToSend,
            userId: user.id,
            shippingInfo: selectedShippingData,
            shippingCost: shipmentCharge,
          }),
        });

        if (!res.ok) throw new Error("Failed to create Stripe session");

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Stripe URL missing in response");
        }
      } else if (selectedPaymentData === "cod") {
        const orderData = {
          userId: user.id,
          orderDate: new Date().toISOString(),
          orderStatus: "Pending Verification",
          deliveryStatus: "Pending",
          paymentStatus: "Pending",
          paymentType: "cod",
          total: totalAmount,
          shippingCost: shipmentCharge,
          shippingInfo: selectedShippingData,
          cartItems: itemsToSend,
          estimatedDelivery: "3-12 Business days",
        };

        const docRef = await addDoc(collection(db, "placedOrders"), orderData);

        toast.success("Order placed with Cash on Delivery.");
        router.push(`/order-success?orderId=${docRef.id}&method=cod`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="lg:sticky lg:top-8 lg:h-fit">
        <Card className="border-n-border/50 backdrop-blur-sm bg-n-card/90 hover:shadow-elegant transition-all duration-500 shadow-warm animate-fade-in relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>

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
                {checkedItems.map((ci, idx) => {
                  const v = variantMap[ci.vid];
                  if (!v) return null;
                  return (
                    <div
                      key={ci.vid}
                      className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent hover:from-n-muted/50 transition-all duration-300 group/item animate-fade-in"
                      style={{ animationDelay: `${700 + idx * 100}ms` }}
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-n-muted to-n-muted/50 shadow-warm flex-shrink-0 group-hover/item:shadow-glow transition-shadow duration-300">
                        <Image
                          src={v.cjImage}
                          alt={v.cjKey ?? v.cjName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-n-foreground text-base mb-1">
                          {v.cjKey ?? v.cjName}
                        </h4>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-n-muted_foreground">
                            Qty: {ci.quantity}
                          </span>
                        </div>
                        <div className="text-lg font-bold bg-text-gradient bg-clip-text text-transparent">
                          {Currency === "USD" ? (
                            <>
                              {(
                                (v.lumiraPrice ?? v.price) * ci.quantity
                              ).toFixed(2)}{" "}
                              {Symbol}
                            </>
                          ) : (
                            <PriceTag
                              basePrice={
                                (v.lumiraPrice ?? v.price) * ci.quantity
                              }
                              userCurrency={Currency}
                              symbol={Symbol}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-6" />

              {/* Totals */}
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
              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                <span className="text-n-muted_foreground font-medium">
                  Shipping
                </span>
                <span className="text-xs text-emerald-700 py-1 text-end">
                  {shipmentCharge
                    ? `${shipmentCharge} ${Symbol}`
                    : "Depends on Shipment Location"}
                </span>
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

              {/* Checkout button */}
              {user && selectedShippingData && selectedPaymentData ? (
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-warm hover:shadow-glow transition-all duration-500 text-lg py-8 rounded-xl font-bold tracking-wide hover-lift relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Lock className="h-5 w-5" />
                    Complete Secure Order
                  </span>
                </Button>
              ) : (
                <Button className="cursor-default opacity-25 w-full py-8 rounded-xl">
                  Complete Secure Order
                </Button>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      <SupportModal
        isOpen={supportModal.isOpen}
        onClose={() => setSupportModal({ isOpen: false, section: "" })}
        initialSection={supportModal.section}
      />
    </>
  );
};

export default CheckOutSummary;
