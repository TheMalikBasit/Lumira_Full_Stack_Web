import Stripe from "stripe";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../Config/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function verifyStripePayment(session_id) {
  if (!session_id) throw new Error("Missing session_id");

  const session = await stripe.checkout.sessions.retrieve(session_id);

  const userId = session.metadata?.userId;
  const shippingInfo = JSON.parse(session.metadata?.shippingInfo || "{}");
  const cartItems = JSON.parse(session.metadata?.cartItems || "[]");
  const shippingCost = JSON.parse(session.metadata?.shippingCost || "0");

  const total =
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    shippingCost;

  const orderData = {
    userId,
    shippingInfo,
    cartItems,
    total,
    paymentStatus: session.payment_status === "paid" ? "Paid" : "Failed",
    orderStatus:
      session.payment_status === "paid" ? "Pending Verification" : "Cancelled",
    deliveryStatus: session.payment_status === "paid" ? "Processing" : "Nil",
    paymentType: "Card/Stripe",
    estimatedDelivery:
      session.payment_status === "paid"
        ? "International Shipping 12–28 Days"
        : "Nil",
    shippingCost,
    orderDate: new Date().toISOString(),
  };

  const collectionName =
    session.payment_status === "paid" ? "placedOrders" : "failedOrders";
  const orderRef = await addDoc(collection(db, collectionName), orderData);

  if (session.payment_status === "paid") {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    const ordersData = userData.orders || [];

    const newOrder = {
      id: orderRef.id,
      status: "Pending Verification",
      timestamp: Date.now(),
    };

    await updateDoc(userRef, {
      orders: [...ordersData, newOrder],
    });
  }

  return {
    success: session.payment_status === "paid",
    orderId: orderRef.id,
  };
}
