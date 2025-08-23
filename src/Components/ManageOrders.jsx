"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Badge } from "@/Components/UI/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTrigger2,
} from "@/Components/UI/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/UI/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/UI/tabs";
import {
  Package,
  Clock,
  DollarSign,
  Truck,
  CheckCircle,
  AlertCircle,
  User,
  Eye,
  ArrowBigDown,
  RefreshCw,
  AlertOctagon,
} from "lucide-react";
import { useAppContext } from "@/Context/AppContext";
import { db } from "../../Config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

const ManageOrders = () => {
  const { router, loading, setLoading } = useAppContext();
  const [orders, setOrders] = useState([]);

  // 🔹 Fetch placedOrders from Firestore
  useEffect(() => {
    async function fetchOrders() {
      try {
        const snapshot = await getDocs(collection(db, "placedOrders"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
      } catch (err) {
        console.error("Error fetching placedOrders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // 🔹 Helpers
  const updateOrderStatus = async (orderId, field, value) => {
    try {
      const orderRef = doc(db, "placedOrders", orderId);
      await updateDoc(orderRef, { [field]: value });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, [field]: value } : order
        )
      );
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Error updating order status");
      console.error("Error updating order status:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "pending verification":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
      case "in_transit":
      case "out for delivery":
        return <Truck className="h-4 w-4" />;
      case "delivered":
      case "completed":
      case "confirmed":
      case "order confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "paid":
        return <DollarSign className="h-4 w-4" />;
      case "failed":
      case "refunded":
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "pending verification":
        return "secondary";
      case "processing":
      case "confirmed":
        return "default";
      case "shipped":
      case "in_transit":
      case "cancelled":
      case "out_for_delivery":
        return "outline";
      case "delivered":
      case "completed":
      case "paid":
      case "refunded":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // 🔹 Separate Active vs Completed Orders
  const activeOrders = orders.filter(
    (o) =>
      o.orderStatus?.toLowerCase() !== "completed" &&
      o.orderStatus?.toLowerCase() !== "cancelled"
  );
  const completedOrders = orders.filter(
    (o) => o.orderStatus?.toLowerCase() === "completed"
  );

  const cancelledOrders = orders
    .filter((o) => o.orderStatus?.toLowerCase() === "cancelled")
    .sort((a, b) => {
      // If a is not refunded and b is refunded, a comes first
      if (
        a.paymentStatus?.toLowerCase() !== "refunded" &&
        b.paymentStatus?.toLowerCase() === "refunded"
      ) {
        return -1;
      }
      // If a is refunded and b is not refunded, b comes first
      if (
        a.paymentStatus?.toLowerCase() === "refunded" &&
        b.paymentStatus?.toLowerCase() !== "refunded"
      ) {
        return 1;
      }
      // Otherwise, keep original order
      return 0;
    });

  const paymentDropdownOptions = [
    { label: "Paid", value: "paid" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
    { label: "Refunded", value: "refunded" },
  ];

  const orderStatusDropdownOptions = [
    { label: "Pending Verification", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const deliveryStatusDropdownOptions = [
    { label: "Pending", value: "pending" },
    { label: "Order Confirmed", value: "confirmed" },
    { label: "Processing", value: "processing" },
    { label: "Dispatched", value: "dispatched" },
    { label: "Shipped", value: "shipped" },
    { label: "Out for Delivery", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
    { label: "Returned", value: "returned" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-n-background via-n-background to-n-accent/5">
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-orange-600 text-lg max-w-2xl mx-auto font-bold">
              Manage and track all customer orders in one place
            </h1>
          </div>

          {loading ? (
            <p className="text-center text-lg min-h-[300px]">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-4 text-n-foreground" />
            </p>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="gradient-n-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      All Orders
                    </CardTitle>
                    <Package className="h-4 w-4 text-n-muted_foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex-wrap flex items-center gap-5">
                      {orders.length}
                      {orders.length !=
                        activeOrders.length +
                          completedOrders.length +
                          cancelledOrders.length && (
                        <AlertOctagon className="h-5 w-5 text-n-muted_foreground" />
                      )}
                    </div>
                    <p className="text-xs text-n-muted_foreground">
                      Total Orders Placed
                    </p>
                  </CardContent>
                </Card>
                <Card className="gradient-n-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Orders
                    </CardTitle>
                    <Package className="h-4 w-4 text-n-muted_foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {activeOrders.length}
                    </div>
                    <p className="text-xs text-n-muted_foreground">
                      Orders in progress
                    </p>
                  </CardContent>
                </Card>

                <Card className="gradient-n-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Payment
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-n-muted_foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        orders.filter((o) =>
                          o.paymentStatus?.toLowerCase().includes("pending")
                        ).length
                      }
                    </div>
                    <p className="text-xs text-n-muted_foreground">
                      Awaiting payment
                    </p>
                  </CardContent>
                </Card>

                <Card className="gradient-n-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      In Transit
                    </CardTitle>
                    <Truck className="h-4 w-4 text-n-muted_foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        orders.filter(
                          (o) =>
                            o.deliveryStatus?.toLowerCase() ===
                            "out for delivery"
                        ).length
                      }
                    </div>
                    <p className="text-xs text-n-muted_foreground">
                      Out for delivery
                    </p>
                  </CardContent>
                </Card>

                <Card className="gradient-n-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-n-muted_foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      $
                      {orders
                        .reduce((sum, order) => sum + (order.total || 0), 0)
                        .toLocaleString()}
                    </div>
                    <p className="text-xs text-n-muted_foreground">
                      From all orders
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Tables */}
              <Card className="gradient-n-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" /> Order Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full gap-4 grid-cols-1 bg-transparent md:bg-n-muted md:grid-cols-3 mb-10 md:mb-0">
                      <TabsTrigger value="active">
                        Active Orders ({activeOrders.length})
                      </TabsTrigger>
                      <TabsTrigger value="completed">
                        Completed Orders ({completedOrders.length})
                      </TabsTrigger>
                      <TabsTrigger value="cancelled">
                        Cancelled Orders ({cancelledOrders.length})
                      </TabsTrigger>
                    </TabsList>

                    {/* Active Orders */}
                    <TabsContent value="active" className="mt-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Order Status</TableHead>
                              <TableHead>Payment</TableHead>
                              <TableHead>Delivery</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {order.shippingInfo?.FirstName}{" "}
                                      {order.shippingInfo?.LastName}
                                    </div>
                                    <div className="text-sm text-n-muted_foreground">
                                      {order.shippingInfo?.Email}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {order.cartItems?.map((item, i) => (
                                    <div key={i} className="text-sm">
                                      {item.quantity}x {item.name}
                                    </div>
                                  ))}
                                </TableCell>
                                <TableCell>${order.total}</TableCell>

                                {/* Order Status */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getStatusVariant(
                                        order.orderStatus
                                      )}
                                      className="gap-1"
                                    >
                                      {getStatusIcon(order.orderStatus)}
                                      {order.orderStatus}
                                    </Badge>
                                    <Select
                                      value={order.orderStatus}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          order.id,
                                          "orderStatus",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger2></SelectTrigger2>
                                      <SelectContent>
                                        <SelectItem value="Pending Verification">
                                          Pending Verification
                                        </SelectItem>
                                        <SelectItem value="Confirmed">
                                          Confirmed
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>

                                {/* Payment Status */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getStatusVariant(
                                        order.paymentStatus
                                      )}
                                      className="gap-1"
                                    >
                                      {getStatusIcon(order.paymentStatus)}
                                      {order.paymentStatus}
                                    </Badge>

                                    <Select
                                      value={order.paymentStatus}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          order.id,
                                          "paymentStatus",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger2></SelectTrigger2>
                                      <SelectContent>
                                        <SelectItem value="Pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="Paid">
                                          Paid
                                        </SelectItem>
                                        <SelectItem value="Refunded">
                                          Refunded
                                        </SelectItem>
                                        <SelectItem value="Failed">
                                          Failed
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>

                                {/* Delivery */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getStatusVariant(
                                        order.deliveryStatus
                                      )}
                                      className="gap-1"
                                    >
                                      {getStatusIcon(order.deliveryStatus)}
                                      {order.deliveryStatus}
                                    </Badge>

                                    <Select
                                      value={order.deliveryStatus}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          order.id,
                                          "deliveryStatus",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger2></SelectTrigger2>
                                      <SelectContent>
                                        <SelectItem value="Pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="Order Confirmed">
                                          Order Confirmed
                                        </SelectItem>
                                        <SelectItem value="Processing">
                                          Processing
                                        </SelectItem>
                                        <SelectItem value="Dispatched">
                                          Dispatched
                                        </SelectItem>
                                        <SelectItem value="Shipped">
                                          Shipped
                                        </SelectItem>
                                        <SelectItem value="Out for Delivery">
                                          Out for Delivery
                                        </SelectItem>
                                        <SelectItem value="Delivered">
                                          Delivered
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  {order.orderDate?.toDate
                                    ? order.orderDate
                                        .toDate()
                                        .toLocaleDateString()
                                    : ""}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push("/order-details/" + order.id)
                                    }
                                  >
                                    <Eye className="h-4 w-4" /> View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    {/* Completed Orders */}
                    <TabsContent value="completed" className="mt-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Payment</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {completedOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                  {order.shippingInfo?.FirstName}{" "}
                                  {order.shippingInfo?.LastName}
                                </TableCell>
                                <TableCell>
                                  {order.cartItems?.map((item, i) => (
                                    <div key={i} className="text-sm">
                                      {item.quantity}x {item.name}
                                    </div>
                                  ))}
                                </TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getStatusVariant(
                                        order.orderStatus
                                      )}
                                    >
                                      {getStatusIcon(order.orderStatus)}
                                      {order.orderStatus}
                                    </Badge>
                                    <Select
                                      value={order.orderStatus}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          order.id,
                                          "orderStatus",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger2></SelectTrigger2>
                                      <SelectContent>
                                        <SelectItem value="Pending Verification">
                                          Pending Verification
                                        </SelectItem>
                                        <SelectItem value="Confirmed">
                                          Confirmed
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getStatusVariant(
                                        order.paymentStatus
                                      )}
                                    >
                                      {getStatusIcon(order.paymentStatus)}
                                      {order.paymentStatus}
                                    </Badge>
                                    <Select
                                      value={order.paymentStatus}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          order.id,
                                          "paymentStatus",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger2></SelectTrigger2>
                                      <SelectContent>
                                        <SelectItem value="Pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="Paid">
                                          Paid
                                        </SelectItem>
                                        <SelectItem value="Refunded">
                                          Refunded
                                        </SelectItem>
                                        <SelectItem value="Failed">
                                          Failed
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {order.orderDate?.toDate
                                    ? order.orderDate
                                        .toDate()
                                        .toLocaleDateString()
                                    : ""}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push("/order-details/" + order.id)
                                    }
                                  >
                                    <Eye className="h-4 w-4" /> View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    {/* Cancelled Orders */}
                    <TabsContent value="cancelled" className="mt-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Payment</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cancelledOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                  {order.shippingInfo?.FirstName}{" "}
                                  {order.shippingInfo?.LastName}
                                </TableCell>
                                <TableCell>
                                  {order.cartItems?.map((item, i) => (
                                    <div key={i} className="text-sm">
                                      {item.quantity}x {item.name}
                                    </div>
                                  ))}
                                </TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getStatusVariant(
                                        order.orderStatus
                                      )}
                                    >
                                      {getStatusIcon(order.orderStatus)}
                                      {order.orderStatus}
                                    </Badge>
                                    <Select
                                      value={order.orderStatus}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          order.id,
                                          "orderStatus",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger2></SelectTrigger2>
                                      <SelectContent>
                                        <SelectItem value="Pending Verification">
                                          Pending Verification
                                        </SelectItem>
                                        <SelectItem value="Confirmed">
                                          Confirmed
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getStatusVariant(
                                        order.paymentStatus
                                      )}
                                    >
                                      {getStatusIcon(order.paymentStatus)}
                                      {order.paymentStatus}
                                    </Badge>
                                    <Select
                                      value={order.paymentStatus}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          order.id,
                                          "paymentStatus",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger2></SelectTrigger2>
                                      <SelectContent>
                                        <SelectItem value="Pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="Paid">
                                          Paid
                                        </SelectItem>
                                        <SelectItem value="Refunded">
                                          Refunded
                                        </SelectItem>
                                        <SelectItem value="Failed">
                                          Failed
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {order.orderDate?.toDate
                                    ? order.orderDate
                                        .toDate()
                                        .toLocaleDateString()
                                    : ""}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push("/order-details/" + order.id)
                                    }
                                  >
                                    <Eye className="h-4 w-4" /> View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default ManageOrders;
