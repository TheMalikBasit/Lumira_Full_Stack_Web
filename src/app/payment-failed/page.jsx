// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { XCircle, Package, CreditCard, AlertTriangle, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { useState as useModalState } from "react";
// import SupportModal from "@/components/SupportModal";

// // Mock order data generator
// const generateFailedOrderData = () => {
//   const orderId = `LUM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
//   const products = [
//     {
//       id: "1",
//       name: "Modern Floor Lamp",
//       price: 249.99,
//       quantity: 1,
//       image: "/src/assets/floor-lamp.jpg"
//     },
//     {
//       id: "2",
//       name: "Pendant Light",
//       price: 189.99,
//       quantity: 2,
//       image: "/src/assets/pendant-lamp.jpg"
//     }
//   ];

//   const subtotal = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const shipping = 15.00;
//   const tax = subtotal * 0.08;
//   const total = subtotal + shipping + tax;

//   const failureReasons = [
//     "Payment was declined by your bank",
//     "Insufficient funds in your account",
//     "Card expired or invalid",
//     "Payment processing timeout",
//     "Security verification failed"
//   ];

//   return {
//     orderId,
//     products,
//     subtotal,
//     shipping,
//     tax,
//     total,
//     paymentStatus: "Failed",
//     paymentType: "Credit Card",
//     orderStatus: "Payment Failed",
//     failureReason: failureReasons[Math.floor(Math.random() * failureReasons.length)],
//     orderDate: new Date().toLocaleDateString()
//   };
// };

// const PaymentFailed = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [orderData] = useState(() => generateFailedOrderData());
//   const [supportModal, setSupportModal] = useModalState({ isOpen: false, section: "" });

//   const handleRetryPayment = () => {
//     navigate("/checkout");
//   };

//   const handleContactSupport = () => {
//     setSupportModal({ isOpen: true, section: "contact" });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-8">
//             <XCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
//             <h1 className="text-4xl font-bold text-n-foreground mb-2">Payment Failed</h1>
//             <p className="text-lg text-n-muted_foreground">We were unable to process your payment. Please try again or contact support.</p>
//           </div>

//           <Alert className="mb-8 border-destructive/50 bg-destructive/10">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertDescription className="text-destructive">
//               <strong>Payment Error:</strong> {orderData.failureReason}
//             </AlertDescription>
//           </Alert>

//           <div className="grid lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Package className="h-5 w-5" />
//                     Order Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium">Order ID:</span>
//                       <span className="font-mono text-muted-foreground">{orderId}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium">Attempt Date:</span>
//                       <span>{order.attemptedAt}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Items in Your Cart</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {order.cartItems?.map((product) => (
//                       <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
//                         <img
//                           src={product.mainImage}
//                           alt={product.name}
//                           className="h-16 w-16 object-cover rounded-md"
//                         />
//                         <div className="flex-1">
//                           <h3 className="font-medium">{product.name}</h3>
//                           <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium">${(product.price * product.quantity)}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CreditCard className="h-5 w-5" />
//                     Payment Status
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span>Payment:</span>
//                       <Badge variant="destructive">
//                         {order.paymentStatus}
//                       </Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Method:</span>
//                       <span>{orderData.paymentType}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Order:</span>
//                       <Badge variant="destructive">
//                         {orderData.orderStatus}
//                       </Badge>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Order Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span>Subtotal:</span>
//                       <span>${orderData.subtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Shipping:</span>
//                       <span>${orderData.shipping.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Tax:</span>
//                       <span>${orderData.tax.toFixed(2)}</span>
//                     </div>
//                     <Separator />
//                     <div className="flex justify-between font-bold text-lg">
//                       <span>Total:</span>
//                       <span>${orderData.total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-3">
//                 <Button onClick={handleRetryPayment} className="w-full">
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Retry Payment
//                 </Button>
//                 <Button onClick={handleContactSupport} variant="outline" className="w-full">
//                   Contact Support
//                 </Button>
//                 <Button onClick={() => navigate("/")} variant="ghost" className="w-full">
//                   Continue Shopping
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer onSupportClick={(section) => setSupportModal({ isOpen: true, section })} />

//       <SupportModal
//         isOpen={supportModal.isOpen}
//         onClose={() => setSupportModal({ isOpen: false, section: "" })}
//         initialSection={supportModal.section}
//       />
//     </div>
//   );
// };

// export default PaymentFailed;

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/Components/UI/lumiraButton";
import { Loader2 } from "lucide-react";

export default function PaymentFailed() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "failedOrders", orderId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setOrder(snapshot.data());
          setLoading(false);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load failed order", err);
        setNotFound(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    setLoading(false);
    fetchOrder();
  }, [orderId]);

  if (!loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-8 h-8 text-n-primary" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="text-n-muted_foreground mt-2">
          We couldn't find any failed order. Please try again.
        </p>
        <Button onClick={() => router.push("/my-checkout")} className="mt-6">
          Try Checkout Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-n-foreground mb-2">
          Payment Failed
        </h1>
        <p className="text-lg text-n-muted_foreground">
          {" "}
          Unfortunately, your payment did not go through. Here's a summary of
          what you tried to order.
        </p>
      </div>
      {/* Shipping Info */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-red-700">
          Shipping Information
        </h2>
        <div className="text-sm space-y-1">
          <p>
            <strong>Name:</strong> {order.shippingInfo?.FirstName}{" "}
            {order.shippingInfo?.LastName}
          </p>
          <p>
            <strong>Email:</strong> {order.shippingInfo?.Email}
          </p>
          <p>
            <strong>Phone:</strong> {order.shippingInfo?.Phone}
          </p>
          <p>
            <strong>Address:</strong> {order.shippingInfo?.FullAddress}
          </p>
          <p>
            <strong>City/State:</strong> {order.shippingInfo?.City},{" "}
            {order.shippingInfo?.State}
          </p>
          <p>
            <strong>Country:</strong> {order.shippingInfo?.Country}
          </p>
          <p>
            <strong>Zip Code:</strong> {order.shippingInfo?.ZipCode}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3">Order Items</h2>
        <div className="space-y-2">
          {order.cartItems?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b py-1 text-sm"
            >
              <span>{item.name}</span>
              <span>
                {item.quantity} × ${item.price} = ${item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="text-xl font-bold text-red-600">
        Total: ${order.total?.toFixed(2)}
      </div>

      {/* Try Again Button */}
      <Button onClick={() => router.push("/my-checkout")} className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
