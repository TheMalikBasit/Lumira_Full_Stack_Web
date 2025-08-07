import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../Config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    // ❌ If session ID is missing — treat as failed
    if (!session_id) {
      const failedOrder = {
        reason: "Missing session_id",
        attemptedAt: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, "failedOrders"), failedOrder);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?failId=${ref.id}`
      );
    }

    // ✅ Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // ❌ If not paid — store as failed
    if (session.payment_status !== "paid") {
      const failedOrder = {
        reason: "Payment not completed",
        session_id,
        userId: session.metadata?.userId || null,
        shippingInfo: session.metadata?.shippingInfo || null,
        cartItems: session.metadata?.cartItems || null,
        total,
        paymentStatus: "Failed",
        orderStatus: "Nil",
        deliveryStatus: "Nil",
        paymentType: "Card/Stripe",
        estimatedDelivery: "Nil",
        shippingCost: shippingCost,
        orderDate: new Date().toISOString(),
      };

      const ref = await addDoc(collection(db, "failedOrders"), failedOrder);

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?failId=${ref.id}`
      );
    }

    // ✅ If paid — create order in Firestore
    const userId = session.metadata?.userId;
    const shippingInfo = JSON.parse(session.metadata?.shippingInfo || "{}");
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");
    const shippingCost = JSON.parse(session.metadata?.shippingCost || "");
    console.log("Session metadata:", session.metadata);
    console.log("Shipping Info Parsed:", shippingInfo);

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity + shippingCost,
      0
    );

    const orderData = {
      userId,
      shippingInfo,
      cartItems,
      total,
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
      deliveryStatus: "Processing",
      paymentType: "Card/Stripe",
      estimatedDelivery: "International Shipping 12-28 Days",
      shippingCost: shippingCost,
      orderDate: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "placedOrders"), orderData);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?orderId=${docRef.id}&method=Card/Stripe`,
      302
    );
  } catch (err) {
    console.error("❌ Payment Verification Error:", err);

    // In case of unexpected failure
    const fallback = {
      reason: "Unexpected server error",
      error: err.message,
      attemptedAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, "failedOrders"), fallback);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?failId=${ref.id}&method=Card/Stripe`
    );
  }
}
