"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { CreditCard, Lock, RefreshCw, Repeat } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { LottieLoading } from "./Loading";
import { Separator } from "@/Components/UI/separator";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import PriceTag from "./PriceTag";
import Image from "next/image";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../Config/firebase";
import toast from "react-hot-toast";
import SupportModal from "./SupportModal";
import { Country } from "country-state-city";
const CheckOutSummary = ({ selectedShippingData, selectedPaymentData }) => {
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
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);
  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    section: "",
  });

  // ✅ Store fetched variant details
  const [variantMap, setVariantMap] = useState({});
  console.log("Variants Map:", variantMap);
  const [shipmentOptions, setShipmentOptions] = useState([]);
  const selectedCountry = selectedShippingData?.Country;
  const filtered = Country.getAllCountries().filter((country) =>
    country.name.toLowerCase().startsWith(selectedCountry?.toLowerCase())
  );
  console.log("Filtered Country:", filtered);
  const isoCode = filtered.length > 0 ? filtered[0].isoCode : null;
  console.log("ISO Code:", isoCode);

  const extracted = checkedItems.reduce((acc, item) => {
    const detail = variantMap[item.vid];
    if (detail) {
      acc[item.vid] = {
        ...detail,
        quantity: item.quantity,
        checked: item.checked,
      };
    }
    return acc;
  }, {});

  const minimizedData = Object.values(extracted).map((item) => ({
    vid: item.vid,
    quantity: item.quantity,
  }));

  console.log("Minimized Data:", minimizedData);
  useEffect(() => {
    const fetchShippingOptions = async () => {
      if (!isoCode || checkedItems.length === 0) {
        setShipmentOptions([]);
        return;
      }
      setLoadingShipping(true);
      try {
        const res = await fetch("/api/getShippingOptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: isoCode,
            items: minimizedData,
          }),
        });

        const data = await res.json();
        console.log("Shipping Options Response:", data);

        if (Array.isArray(data.common)) {
          setShipmentOptions(data.common);
        } else {
          setShipmentOptions([]);
        }
      } catch (error) {
        toast.error("Error fetching shipping options");
      } finally {
        setLoadingShipping(false);
      }
    };
    fetchShippingOptions();
  }, [isoCode]);

  // console.log("Shipping Options:", shipmentOptions);

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
    const t = subtotal + (selectedShippingOption?.logisticPrice || 0);
    setTotal(t);
  }, [subtotal, selectedShippingOption]);

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

      const totalAmount = subtotal + selectedShippingOption?.logisticPrice;
      if (selectedPaymentData === "stripe") {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsToSend,
            userId: user.id,
            shippingInfo: selectedShippingData,
            shippingCost: selectedShippingOption?.logisticPrice,
            shippingMethod: selectedShippingOption || [],
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
          shippingCost: selectedShippingOption?.logisticPrice,
          shippingInfo: selectedShippingData,
          shippingMethod: selectedShippingOption,
          cartItems: itemsToSend,
          estimatedDelivery: selectedShippingOption?.logisticAging,
        };

        // ✅ Generate custom LUM ID
        const randomPart = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();
        const timePart = Date.now().toString().slice(-6);
        const orderId = `LUM-${randomPart}${timePart}`;

        const orderRef = doc(db, "placedOrders", orderId);

        await setDoc(orderRef, orderData);

        toast.success("Order placed with Cash on Delivery.");
        router.push(`/order-success?orderId=${orderId}&method=cod`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  console.log(
    "Selected Shipping Option:",
    selectedShippingOption?.logisticAging
  );
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
                {checkedItems.length === 0 ? (
                  <div className="text-orange-600 flex gap-4 p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent hover:from-n-muted/50 transition-all duration-300 group/item animate-fade-in">
                    No items selected
                  </div>
                ) : (
                  checkedItems.map((ci, idx) => {
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
                  })
                )}
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

              <div className="p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                {shipmentOptions.length > 0 ? (
                  <>
                    <span className="text-n-muted_foreground font-medium flex justify-between">
                      Select A Shipping Option
                      {loadingShipping && (
                        <RefreshCw className="h-5 w-5 animate-spin ml-2 text-n-foreground" />
                      )}
                    </span>
                    <br />
                  </>
                ) : (
                  <>
                    <span className="text-n-muted_foreground font-medium flex justify-between">
                      Select An Address to Fetch Options{" "}
                      {loadingShipping && (
                        <RefreshCw className="h-5 w-5 animate-spin ml-2 text-n-foreground" />
                      )}
                    </span>
                  </>
                )}
              </div>
              {shipmentOptions.length > 0 ? (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-n-muted_foreground scrollbar-track-transparent p-4 rounded-xl bg-gradient-to-r from-n-muted/30 to-transparent">
                  {shipmentOptions.map((opt, idx) => (
                    <div
                      className="flex flex-row w-full items-center"
                      key={idx}
                    >
                      <p className="text-orange-600">{idx + 1}</p>
                      <div
                        className={`ml-2 p-2 w-full border rounded-lg bg-white cursor-pointer hover:bg-n-primary/10 transition-colors duration-300 ${
                          selectedShippingOption === opt
                            ? "ring-2 ring-n-primary bg-n-primary/10"
                            : ""
                        }`}
                        onClick={() => setSelectedShippingOption(opt)}
                      >
                        <p className="font-medium text-n-foreground">
                          {opt.logisticName === "CJPacket Asia Liquid Line"
                            ? "Standard Shipping"
                            : opt.logisticName}
                        </p>
                        <p className="text-sm text-n-muted_foreground">
                          ${opt.logisticPrice} · {opt.logisticAging} days
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : loadingShipping ? (
                <p className="text-sm text-n-muted_foreground">
                  Fetching shipping options...
                </p>
              ) : (
                <p className="text-sm text-n-muted_foreground">
                  No options found
                </p>
              )}

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
              {user &&
              selectedShippingData &&
              selectedPaymentData &&
              checkedItems.length > 0 ? (
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
