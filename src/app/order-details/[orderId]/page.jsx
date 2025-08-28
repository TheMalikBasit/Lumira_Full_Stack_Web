"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import { Separator } from "@/Components/UI/separator";
import { Progress } from "@/Components/UI/progress";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/LumiraFooter";
import SupportModal from "@/Components/SupportModal";
import { useAppContext } from "@/Context/AppContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import { LottieLoading } from "@/Components/Loading";
import { db } from "../../../../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import BackLights from "@/Components/BackLights";
const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { router, products, loading } = useAppContext();
  const [orderDetails, setOrderDetails] = useState(null);
  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    section: "",
  });
  const [deliveryProgress, setDeliveryProgress] = useState(null);
  const [deliveryProgress1, setDeliveryProgress1] = useState(null);
  const [deliveryProgress2, setDeliveryProgress2] = useState(null);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [newDateVar, setNewDateVar] = useState(null);
  const [customLoader, setCustomLoader] = useState(true);
  const [width, setWidth] = useState(0); // safe default for SSR

  useEffect(() => {
    if (!loading) {
      const handleResize = () => setWidth(window.innerWidth);

      handleResize(); // set initial width
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  });

  const trackingSteps = [
    { label: "Pending", completed: deliveryProgress >= 0 },
    { label: "Order Confirmed", completed: deliveryProgress >= 20 },
    { label: "Processing", completed: deliveryProgress >= 40 },
    { label: "Dispatched", completed: deliveryProgress >= 60 },
    { label: "Shipped", completed: deliveryProgress >= 75 },
    { label: "Out for Delivery", completed: deliveryProgress >= 90 },
    { label: "Delivered", completed: deliveryProgress >= 100 },
  ];

  const trackingStepsMobile1 = [
    { label: "Pending", completed: deliveryProgress1 >= 0 },
    { label: "Order Confirmed", completed: deliveryProgress1 >= 50 },
    { label: "Processing", completed: deliveryProgress1 >= 100 },
  ];

  const trackingStepsMobile2 = [
    { label: "Dispatched", completed: deliveryProgress2 > 0 },
    { label: "Shipped", completed: deliveryProgress2 >= 50 },
    { label: "Out for Delivery", completed: deliveryProgress2 >= 75 },
    { label: "Delivered", completed: deliveryProgress2 >= 100 },
  ];

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        // Client-side fetch (respects Firestore rules)
        const docRef = doc(db, "placedOrders", orderId);
        const docSnap = await getDoc(docRef, { source: "server" }); // avoid cache

        if (docSnap.exists()) {
          setOrderDetails({
            id: docSnap.id,
            ...docSnap.data(),
            trackingNumber: "Available After Dispached",
          });
        }
        setCustomLoader(false);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (orderDetails) {
      const filteredProducts = products
        .map((prod) => {
          const cartItem = orderDetails?.cartItems?.find(
            (item) => item.id === prod.id
          );
          return cartItem ? { ...prod, ...cartItem } : null;
        })
        .filter(Boolean);
      const timeStamp = orderDetails.orderDate;
      if (orderDetails.deliveryStatus.toLowerCase() === "pending") {
        setDeliveryProgress(10);
        setDeliveryProgress1(35);
        setDeliveryProgress2(0);
      } else if (
        orderDetails.deliveryStatus.toLowerCase() === "order confirmed"
      ) {
        setDeliveryProgress(20);
        setDeliveryProgress1(50);
        setDeliveryProgress2(0);
      } else if (orderDetails.deliveryStatus.toLowerCase() === "processing") {
        setDeliveryProgress(40);
        setDeliveryProgress1(100);
        setDeliveryProgress2(0);
      } else if (orderDetails.deliveryStatus.toLowerCase() === "dispatched") {
        setDeliveryProgress(60);
        setDeliveryProgress1(100);
        setDeliveryProgress2(35);
      } else if (orderDetails.deliveryStatus.toLowerCase() === "shipped") {
        setDeliveryProgress(75);
        setDeliveryProgress1(100);
        setDeliveryProgress2(50);
      } else if (
        orderDetails.deliveryStatus.toLowerCase() === "out for delivery"
      ) {
        setDeliveryProgress(90);
        setDeliveryProgress1(100);
        setDeliveryProgress2(75);
      } else if (orderDetails.deliveryStatus.toLowerCase() === "delivered") {
        setDeliveryProgress(100);
        setDeliveryProgress1(100);
        setDeliveryProgress2(100);
      }
      setNewDateVar(timeStamp);
      setOrderedProducts(filteredProducts);
    }
  }, [orderDetails]);

  if (loading) return <LottieLoading />;
  const dateObj = orderDetails?.orderDate.toDate
    ? orderDetails?.orderDate.toDate()
    : new Date(orderDetails?.orderDate);

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

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-n-background flex items-center justify-center">
        <div className="text-center">
          {customLoader ? (
            <>
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-n-foreground" />
              <p>Loading Order Details....</p>
            </>
          ) : (
            <>
              <p>
                Order Not Found {"("}Incorrect ID{")"}
              </p>
              <Button
                size="sm"
                onClick={() => router.push("/order-history")}
                className="flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Your Order History
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar bgBlur />
      <div className="min-h-screen backdrop-blur-3xl mt-20 overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          {/* <BackLights L2 L3 /> */}
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start md:items-center flex-col md:flex-row gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/order-history")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-n-foreground">
                  Order Confirmation
                </h1>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 ">
              <div className="lg:col-span-2 space-y-6 overflow-hidden">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-n-foreground">
                      <Truck className="h-5 w-5" />
                      Delivery Progress
                      {orderDetails.deliveryStatus.toLowerCase() ===
                        "cancelled" && (
                        <p className="text-lg text-red-500">
                          Your order has been cancelled.
                        </p>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`space-y-4`}>
                      {width > 600 ? (
                        <>
                          <Progress value={deliveryProgress} className="h-2" />
                          <div className="flex justify-between">
                            {trackingSteps.map((step) => (
                              <div
                                key={step.label}
                                className="flex flex-col items-center text-center"
                              >
                                <div
                                  className={`w-3 h-3 rounded-full mb-2 ${
                                    step.completed
                                      ? "bg-n-foreground"
                                      : "bg-n-muted"
                                  }`}
                                />
                                <span
                                  className={`text-xs ${
                                    step.completed
                                      ? "text-n-foreground font-medium"
                                      : "text-n-muted_foreground"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col justify-between space-y-3">
                            <Progress
                              value={deliveryProgress1}
                              className="h-2"
                            />
                            <div className="flex justify-between">
                              {trackingStepsMobile1.map((step) => (
                                <div
                                  key={step.label}
                                  className="flex flex-col items-center text-center"
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full mb-2 ${
                                      step.completed
                                        ? "bg-n-foreground"
                                        : "bg-n-muted"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs ${
                                      step.completed
                                        ? "text-n-foreground font-medium"
                                        : "text-n-muted_foreground"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Progress
                              value={deliveryProgress2}
                              className="h-2"
                            />
                            <div className="flex justify-between">
                              {trackingStepsMobile2.map((stepdad) => (
                                <div
                                  key={stepdad.label}
                                  className="flex flex-col items-center text-center"
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full mb-2 ${
                                      stepdad.completed
                                        ? "bg-n-foreground"
                                        : "bg-n-muted"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs ${
                                      stepdad.completed
                                        ? "text-n-foreground font-medium"
                                        : "text-n-muted_foreground"
                                    }`}
                                  >
                                    {stepdad.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {orderDetails.trackingNumber && (
                        <div className="mt-4 p-4 bg-n-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1 text-n-muted_foreground">
                            Order ID: #{orderDetails.id}
                          </p>
                          <p className="text-sm font-medium mb-1 text-n-foreground">
                            Tracking Number:
                          </p>
                          <p className="font-mono text-n-foreground">
                            {orderDetails.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-n-foreground">
                      <Package className="h-5 w-5" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderDetails?.cartItems?.map((product) => (
                        <div
                          key={product.vid}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={800}
                            height={800}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-n-foreground">
                              {product.name}
                            </h3>
                            <p className="text-sm text-n-muted_foreground">
                              Quantity: {product.quantity}
                            </p>
                            <p className="text-sm text-n-muted_foreground">
                              Unit Price: {product.price} $
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg text-n-foreground">
                              {product.price * product.quantity} $
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-n-foreground">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="font-medium text-n-foreground">
                        {orderDetails.shippingInfo.FirstName}{" "}
                        {orderDetails.shippingInfo.LastName}
                      </p>
                      <p className="text-n-foreground">
                        {orderDetails.shippingInfo.FullAddress}
                      </p>
                      <p className="text-n-foreground">
                        {orderDetails.shippingInfo.City},{" "}
                        {orderDetails.shippingInfo.State}{" "}
                        {orderDetails.shippingInfo.ZipCode}
                      </p>
                      <p className="text-n-foreground">
                        {orderDetails.shippingInfo.Country}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={"text-n-foreground"}>
                      Order Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-n-foreground">Order:</span>
                        <Badge
                          variant="default"
                          className="bg-n-foreground text-n-primary_foreground"
                        >
                          {orderDetails.orderStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-n-foreground">
                        <span>Payment:</span>
                        <Badge
                          variant="default"
                          className="bg-n-foreground text-n-primary_foreground"
                        >
                          {orderDetails.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-n-foreground">
                        <span>Method:</span>
                        <Badge
                          variant="default"
                          className="bg-n-foreground text-n-primary_foreground"
                        >
                          {orderDetails.paymentType}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-n-foreground">Delivery:</span>
                        <Badge variant="secondary">
                          {orderDetails.deliveryStatus}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="text-center">
                        <p className="text-sm text-n-muted_foreground">
                          Estimated Delivery
                        </p>
                        <p className="font-medium text-n-muted_foreground">
                          {orderDetails.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-n-muted_foreground" />
                      Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-n-muted_foreground">
                          Subtotal:
                        </span>
                        <span className="text-n-muted_foreground">
                          {" "}
                          {orderDetails.total - orderDetails.shippingCost} $
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-n-muted_foreground">
                          Shipping:
                        </span>
                        <span className="text-n-muted_foreground">
                          {orderDetails.shippingCost} $
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${orderDetails.tax.toFixed(2)}</span>
                      </div> */}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg text-n-muted_foreground">
                        <span className="text-n-muted_foreground">Total:</span>
                        <span>{orderDetails.total} $</span>
                      </div>
                      <div className="text-sm text-n-muted_foreground pt-2">
                        <p className=" text-n-muted_foreground">
                          Payment Method: {orderDetails.paymentType}
                        </p>
                        <p className=" text-n-muted_foreground">
                          Order Date: {formattedDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      setSupportModal({ isOpen: true, section: "contact-us" })
                    }
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => router.push("/all-products")}
                  >
                    Shop Again
                  </Button>
                  {deliveryProgress < 20 &&
                    deliveryProgress1 < 50 &&
                    orderDetails.orderStatus.toLowerCase() !== "cancelled" && (
                      <Button
                        className="w-full"
                        // onClick={() => router.push("/all-products")}
                      >
                        Cancel Order
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer
          onSupportClick={(section) =>
            setSupportModal({ isOpen: true, section })
          }
        />
      </div>
      <SupportModal
        isOpen={supportModal.isOpen}
        onClose={() => setSupportModal({ isOpen: false, section: "" })}
        initialSection={supportModal.section}
      />
    </>
  );
};

export default OrderConfirmation;
