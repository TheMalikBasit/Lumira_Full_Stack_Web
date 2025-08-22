"use client";
import {
  CheckCircle,
  Package,
  CreditCard,
  Truck,
  Clock,
  Loader2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import { Separator } from "@/Components/UI/separator";
import Navbar from "@/Components/Navbar";
// import { useState as useModalState } from "react";
import SupportModal from "@/Components/SupportModal";
import { useEffect, useState } from "react";
import { db } from "../../../Config/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useAppContext } from "@/Context/AppContext";
import BackLights from "@/Components/BackLights";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/Components/LumiraFooter";
export default function PaymentFailed() {
  const [order, setOrder] = useState(null);
  const { products, router, loading, setLoading } = useAppContext();
  const [orderedProducts, setOrderedProducts] = useState([]);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");
  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    section: "",
  });
  const [newDateVar, setNewDateVar] = useState(null);
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        // Client-side fetch (respects Firestore rules)
        const docRef = doc(db, "failedOrders", orderId);
        const docSnap = await getDoc(docRef, { source: "server" });

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);
  const dateObj = new Date(newDateVar);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString();
  useEffect(() => {
    if (order) {
      const filteredProducts = products
        .map((prod) => {
          const cartItem = order?.cartItems?.find(
            (item) => item.id === prod.id
          );
          return cartItem ? { ...prod, ...cartItem } : null;
        })
        .filter(Boolean);
      const timeStamp = order.orderDate;

      setNewDateVar(timeStamp);
      setOrderedProducts(filteredProducts);
    }
  }, [order]);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-n-primary" />
        <p className="mt-2 text-n-muted_foreground">
          Loading your order summary...
        </p>
      </div>
    );
  }

  if (!order || method === null || method !== order.paymentType) {
    return (
      <div className="p-8 text-center text-red-500">
        Order not found. Please contact support if you believe this is an error.
      </div>
    );
  }

  return (
    <>
      <Navbar bgBlur />
      <div className="min-h-screen backdrop-blur-2xl mt-20">
        <BackLights L2 L3 />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <XCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
              {method == "Card/Stripe" && order.paymentType == "Card/Stripe" ? (
                <>
                  <h1 className="text-4xl font-bold text-n-foreground mb-2">
                    Payment Failed!
                  </h1>
                  <p className="text-lg text-n-muted_foreground">
                    We were unable to process your payment. Please try again or
                    contact support.
                  </p>
                </>
              ) : (
                <>
                  {" "}
                  <h1 className="text-4xl font-bold text-n-foreground mb-2">
                    Failed To Place Order
                  </h1>
                  <p className="text-lg text-n-muted_foreground">
                    We were unable to place your order. Please try again or
                    contact support if problem persists.
                  </p>
                </>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-n-foreground">
                      <Package className="h-5 w-5" />
                      Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-n-foreground">
                          Order ID:
                        </span>
                        <span className="font-mono text-n-foreground">
                          {orderId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-n-foreground">
                          Order Date:
                        </span>
                        <span className="text-n-foreground">{date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-n-foreground">
                          Order Time:
                        </span>
                        <span className="text-n-foreground">{time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-n-foreground">
                          Estimated Delivery:
                        </span>
                        <span className="text-n-foreground">
                          {order.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Products Ordered */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-n-foreground">
                      Products Ordered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            height={200}
                            width={200}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-n-foreground">
                              {product.name}
                            </h3>
                            <p className="text-sm text-n-muted_foreground">
                              Qty: {product.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-n-foreground">
                              ${product.price * product.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status & Summary */}
              <div className="space-y-6">
                {/* Status Cards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-n-foreground" />
                      Payment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-n-foreground">Payment:</span>
                        <Badge
                          variant="default"
                          className="bg-n-foreground text-n-primary_foreground"
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-n-foreground">Method:</span>
                        <span className="text-n-foreground">
                          {order.paymentType}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-n-foreground" />
                      Order Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-n-foreground">Order:</span>
                        <Badge
                          variant="default"
                          className="bg-n-foreground text-n-primary_foreground"
                        >
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-n-foreground">Delivery:</span>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {order.deliveryStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-n-foreground">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-n-foreground">Subtotal:</span>
                        <span className="text-n-foreground">
                          {order.total - order.shippingCost} $
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-n-foreground">Shipping:</span>
                        <span className="text-n-foreground">
                          ${order.shippingCost}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-n-foreground">Total:</span>
                        <span className="text-n-foreground">
                          {order.total} $
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    // onClick={() => Router.push("/order-history")}
                    className="w-full"
                    variant="outline"
                  >
                    View Order History
                  </Button>
                  <Button onClick={() => router.push("/")} className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        onSupportClick={(section) => setSupportModal({ isOpen: true, section })}
      />

      <SupportModal
        isOpen={supportModal.isOpen}
        onClose={() => setSupportModal({ isOpen: false, section: "" })}
        initialSection={supportModal.section}
      />
    </>
  );
}
