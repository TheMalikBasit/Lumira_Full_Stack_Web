"use client";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Package,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSignIcon,
  Wallet,
  Wallet2,
  WalletCards,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/UI/table";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/LumiraFooter";
import SupportModal from "@/Components/SupportModal";
import { useAppContext } from "@/Context/AppContext";
import { db } from "../../../Config/firebase";
import { getDoc, doc, collection } from "firebase/firestore";
import Image from "next/image";
import { Loading, LottieLoading } from "@/Components/Loading";
import { useUser } from "@clerk/nextjs";
const OrderHistory = () => {
  const { orderHistory, router, loading, products } = useAppContext();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [toPay, setToPay] = useState(null);
  const [unsorted, setUnsorted] = useState([]);

  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    section: "",
  });

  const orderIds = Array.isArray(orderHistory)
    ? orderHistory.map((order) => order.id)
    : [];

  useEffect(() => {
    if (user) {
      const fetchAllOrders = async () => {
        try {
          const orderPromises = orderIds.map(async (itemId) => {
            const ordersRef = doc(db, "placedOrders", itemId);
            const ordersSnapshot = await getDoc(ordersRef);

            if (!ordersSnapshot.exists()) return null;

            const orderData = ordersSnapshot.data();
            return {
              ...orderData,
              orderId: itemId,
            };
          });

          const results = await Promise.all(orderPromises);
          const validOrders = results.filter((order) => order !== null);
          setUnsorted(validOrders);
        } catch (error) {}
      };

      if (orderIds.length > 0) {
        fetchAllOrders();
      }
    }
  }, [orderHistory, user]);

  useEffect(() => {
    const sortedOrders = [...unsorted].sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );
    const totalUnpaid = unsorted
      .filter((item) => item.paymentStatus !== "Paid")
      .reduce((acc, item) => acc + item.total, 0);

    setOrders(sortedOrders);
    setToPay(totalUnpaid);
  }, [unsorted]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "confirmed":
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-white" />;
      case "processing":
      case "shipped":
        return <Truck className="h-4 w-4 text-yellow-500" />;
      case "pending verification":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "confirmed":
      case "delivered":
      case "paid":
        return "default";
      case "processing":
      case "shipped":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <>
      <Navbar bgBlur />
      <div className="min-h-screen bg-n-background">
        <div className="container mx-auto px-4 py-12 mt-15">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start md:items-center flex-col md:flex-row justify-between spa mb-8 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-n-foreground mb-2">
                  Order History
                </h1>
                <p className="text-n-muted_foreground">
                  Track and manage your orders
                </p>
              </div>
              <Button onClick={() => router.push("/")} variant="outline">
                Continue Shopping
              </Button>
            </div>

            {loading ? (
              <>
                <LottieLoading className={"min-h-screen relative"} />
              </>
            ) : (
              <>
                {orders.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Package className="h-16 w-16 text-n-muted_foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        No Orders Yet
                      </h3>
                      <p className="text-n-muted_foreground mb-6">
                        You haven't placed any orders yet. Start shopping to see
                        your orders here.
                      </p>
                      <Button onClick={() => router.push("/all-products")}>
                        Browse Products
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-n-primary" />
                            <div>
                              <p className="text-2xl font-bold text-n-foreground">
                                {orders.length}
                              </p>
                              <p className="text-sm text-n-muted_foreground">
                                Total Orders
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <div className="mr-5 flex flex-row items-center">
                                <CreditCard className="h-8 w-8 text-green-600 mr-5" />
                                <p className="text-2xl font-bold text-n-foreground mr-2">
                                  $
                                  {orders.reduce(
                                    (sum, order) => sum + order.total,
                                    0
                                  ) - toPay.toFixed(1)}
                                </p>
                                <p className="text-sm text-n-muted_foreground">
                                  Total Spent
                                </p>
                              </div>
                              <div className="flex flex-row items-center">
                                <Wallet2 className="h-8 w-8 text-green-600 mr-5" />
                                <p className="text-2xl font-bold text-n-foreground mr-2">
                                  {"$"}
                                  {toPay.toFixed(1)}
                                  {""}
                                </p>
                                <p className="text-sm text-n-muted_foreground">
                                  Yet To Pay!
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold text-n-foreground">
                                {
                                  orders.filter(
                                    (order) =>
                                      order.orderStatus.toLowerCase() ===
                                      "completed"
                                  ).length
                                }
                              </p>
                              <p className="text-sm text-n-muted_foreground">
                                Completed
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Orders Table */}

                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-n-primary" />
                          Recent Orders
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-n-muted/50">
                              <TableHead className="font-semibold text-center">
                                Actions
                              </TableHead>
                              <TableHead className="font-semibold">
                                Order Details
                              </TableHead>
                              <TableHead className="font-semibold">
                                Status
                              </TableHead>
                              <TableHead className="font-semibold">
                                Payment
                              </TableHead>
                              <TableHead className="font-semibold">
                                Items
                              </TableHead>
                              <TableHead className="font-semibold text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order, index) => {
                              const dateObj = order.orderDate?.toDate
                                ? order.orderDate.toDate()
                                : new Date(order.orderDate);

                              const datePart = dateObj.toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              );

                              const timePart = dateObj.toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                }
                              );

                              const formattedDate = `${datePart} at ${timePart}`;
                              const cartItemsData = order.cartItems
                                .map((item) =>
                                  products.find(
                                    (product) => product.id === item.id
                                  )
                                )
                                .filter(Boolean);
                              return (
                                <TableRow
                                  key={index}
                                  className="hover:bg-n-muted/30 transition-colors"
                                >
                                  <TableCell className="text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        router.push(
                                          "/order-details/" + order.orderId
                                        );
                                      }}
                                      className="flex items-center gap-2 hover:bg-n-primary/10"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Package className="min-h-4 min-w-4 max-h-4 max-w-4 text-n-primary" />
                                        <span className="font-medium text-n-foreground">
                                          #{order.orderId}
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-1 text-sm text-n-muted_foreground">
                                        <Calendar className="min-h-4 min-w-4 max-h-4 max-w-4" />
                                        {formattedDate}
                                      </div>
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <div className="space-y-2">
                                      <Badge
                                        variant={getStatusVariant(
                                          order.orderStatus
                                        )}
                                        className="flex items-center gap-1 w-fit"
                                      >
                                        {getStatusIcon(order.orderStatus)}
                                        {order.orderStatus}
                                      </Badge>
                                      <div className="text-xs text-n-muted_foreground">
                                        Delivery:{" "}
                                        <span className="font-medium">
                                          {order.deliveryStatus}
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <Badge
                                      variant={getStatusVariant(
                                        order.paymentStatus
                                      )}
                                      className="flex items-center gap-1 w-fit"
                                    >
                                      <CreditCard className="h-3 w-3" />
                                      {order.paymentStatus}
                                    </Badge>
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="flex -space-x-2">
                                        {order.cartItems
                                          .slice(0, 3)
                                          .map((product, index) => (
                                            <Image
                                              key={product.vid}
                                              src={product.image}
                                              alt={product.name}
                                              width={800}
                                              height={800}
                                              className="min-h-2 min-w-2 max-h-8 max-w-8 rounded-full border-2 border-background object-cover"
                                              style={{ zIndex: 10 - index }}
                                            />
                                          ))}

                                        {order.cartItems.length > 3 && (
                                          <div className="h-8 w-8 rounded-full border-2 border-background bg-n-muted flex items-center justify-center text-xs font-medium">
                                            +{order.cartItems.length - 3}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-sm text-n-muted_foreground">
                                        {order.cartItems.reduce(
                                          (sum, item) => sum + item.quantity,
                                          0
                                        )}{" "}
                                        items
                                      </div>
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-right">
                                    <div className="space-y-1">
                                      <p className="text-lg font-semibold text-n-primary">
                                        ${order.total}
                                      </p>
                                      <p className="text-xs text-n-muted_foreground">
                                        Avg: $
                                        {(
                                          order.total /
                                          order.cartItems.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0
                                          )
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Footer
          onSupportClick={(section) =>
            setSupportModal({ isOpen: true, section })
          }
        />

        <SupportModal
          isOpen={supportModal.isOpen}
          onClose={() => setSupportModal({ isOpen: false, section: "" })}
          initialSection={supportModal.section}
        />
      </div>
    </>
  );
};

export default OrderHistory;
