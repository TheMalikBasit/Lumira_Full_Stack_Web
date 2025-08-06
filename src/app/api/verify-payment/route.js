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
        attemptedAt: serverTimestamp(),
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

    console.log("Session metadata:", session.metadata);
    console.log("Shipping Info Parsed:", shippingInfo);

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      userId,
      shippingInfo,
      cartItems,
      total,
      isPaid: true,
      paymentStatus: "Paid",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "placedOrders"), orderData);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?orderId=${docRef.id}`,
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?failId=${ref.id}`
    );
  }
}
