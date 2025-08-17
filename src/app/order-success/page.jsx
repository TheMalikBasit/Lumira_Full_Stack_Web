"use client";
import {
  CheckCircle,
  Package,
  CreditCard,
  Truck,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import { Separator } from "@/Components/UI/separator";
import Navbar from "@/Components/Navbar";
import SupportModal from "@/Components/SupportModal";
import { useEffect, useState } from "react";
import { db } from "../../../Config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import BackLights from "@/Components/BackLights";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Footer from "@/Components/LumiraFooter";

// ✅ helper to resolve variants from Firestore
async function resolveOrderItems(order) {
  const resolved = [];

  for (const item of order.cartItems || []) {
    try {
      // fetch main product
      const productRef = doc(db, "products", item.pid);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) continue;
      const productData = productSnap.data();

      // if variant exists → fetch from subcollection
      if (item.vid) {
        const variantRef = doc(db, `products/${item.pid}/variants/${item.vid}`);
        const variantSnap = await getDoc(variantRef);
        if (variantSnap.exists()) {
          const variantData = variantSnap.data();
          resolved.push({
            ...item,
            name: variantData.cjKey || variantData.cjName || "Variant",
            image: variantData.cjImage || productData.mainImage,
            price: item.price, // already stored at checkout
            sku: item.sku || variantData.cjSku || null,
          });
          continue;
        }
      }

      // fallback if no variant
      resolved.push({
        ...item,
        name: productData.name,
        image: productData.mainImage,
        price: item.price,
        sku: item.sku || null,
      });
    } catch (err) {
      console.error("❌ Error resolving product:", err);
    }
  }

  return resolved;
}

export default function PaymentSuccess() {
  const [order, setOrder] = useState(null);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");
  const { user } = useUser();
  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    section: "",
  });

  // ✅ Fetch the order from Firestore
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "placedOrders", orderId);
        const docSnap = await getDoc(docRef, { source: "server" });

        if (docSnap.exists()) {
          const orderData = { id: docSnap.id, ...docSnap.data() };
          setOrder(orderData);

          // resolve product + variant images/names
          const items = await resolveOrderItems(orderData);
          setOrderedProducts(items);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ✅ Attach order to user document (avoid duplicate entry)
  useEffect(() => {
    if (user && orderId && order) {
      const handleOrder = async () => {
        try {
          const userRef = doc(db, "users", user.id);
          const userSnapshot = await getDoc(userRef);
          if (!userSnapshot.exists()) return;

          const userData = userSnapshot.data();
          const ordersData = userData.orders ?? [];

          const orderExists = ordersData.some((item) => item.id === orderId);

          if (!orderExists) {
            const newOrder = {
              id: orderId,
              status: order.orderStatus || "Pending Verification",
              orderedAt: new Date(),
            };

            await updateDoc(userRef, { orders: [...ordersData, newOrder] });
            toast.success("Order Placed");
          }
        } catch (err) {
          console.error("Error updating user orders:", err);
        }
      };
      handleOrder();
    }
  }, [order, user, orderId]);

  // ✅ Date handling
  const dateObj = order?.orderDate?.toDate
    ? order?.orderDate?.toDate()
    : new Date(order?.orderDate);

  const datePart = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timePart = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = `${datePart} at ${timePart}`;

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

  if (!order || !method || method !== order.paymentType) {
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
            {/* ✅ Success Header */}
            <div className="text-center mb-8">
              <CheckCircle className="h-20 w-20 text-n-foreground mx-auto mb-4" />
              {order.paymentType === "Card/Stripe" ? (
                <>
                  <h1 className="text-4xl font-bold text-n-foreground mb-2">
                    Payment Successful!
                  </h1>
                  <p className="text-lg text-n-muted_foreground">
                    Thank you for your order. Your payment has been processed
                    successfully.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-n-foreground mb-2">
                    Order Placed
                  </h1>
                  <p className="text-lg text-n-muted_foreground">
                    Thank you for your order. You will be asked for order
                    confirmation shortly!
                  </p>
                </>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* ✅ Order Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-n-foreground">
                      <Package className="h-5 w-5" /> Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium text-n-foreground">
                          Order ID:
                        </span>
                        <span className="font-mono text-n-foreground">
                          {orderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-n-foreground">
                          Order Date:
                        </span>
                        <span className="text-n-foreground">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
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

                {/* ✅ Products Ordered */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-n-foreground">
                      Products Ordered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderedProducts.map((item, idx) => (
                        <div
                          key={item.vid || item.pid || idx}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.name || "Product"}
                            height={200}
                            width={200}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-n-foreground">
                              {item.name}
                            </h3>
                            <p className="text-sm text-n-muted_foreground">
                              Qty: {item.quantity}
                            </p>
                            {item.sku && (
                              <p className="text-xs text-n-muted_foreground">
                                SKU: {item.sku}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-n-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ✅ Status & Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-n-foreground" />{" "}
                      Payment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-n-foreground">Payment:</span>
                        <Badge className="bg-n-foreground text-n-primary_foreground">
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
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
                      <Truck className="h-5 w-5 text-n-foreground" /> Order
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-n-foreground">Order:</span>
                        <Badge className="bg-n-foreground text-n-primary_foreground">
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-n-foreground">Delivery:</span>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" /> {order.deliveryStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                          {orderedProducts
                            .reduce((sum, i) => sum + i.price * i.quantity, 0)
                            .toFixed(2)}{" "}
                          $
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

                {/* ✅ Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => (window.location.href = "/order-history")}
                    className="w-full"
                    variant="outline"
                  >
                    View Order History
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="w-full"
                  >
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
