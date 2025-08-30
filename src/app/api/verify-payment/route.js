import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "../../../../Config/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) throw new Error("Missing session_id");

    // ✅ Fetch session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const { userId, cartRefId } = session.metadata || {};

    if (!userId || !cartRefId) throw new Error("Missing metadata");

    const cartRef = adminDB.collection("tempCarts").doc(cartRefId);
    const cartSnap = await cartRef.get();

    if (!cartSnap.exists) throw new Error("Temp cart not found");

    const {
      shippingInfo,
      items: cartItems,
      shippingCost,
      shippingMethod,
    } = cartSnap.data();

    // ❌ If not paid → fail order (cleanup temp cart too!)
    if (session.payment_status !== "paid") {
      await adminDB.collection("failedOrders").doc(`fail_${Date.now()}`).set({
        reason: "Payment not completed",
        session_id,
        userId,
        paymentStatus: "Failed",
        orderStatus: "Cancelled",
        deliveryStatus: "Nil",
        paymentType: "Card/Stripe",
        estimatedDelivery: "Nil",
        orderDate: new Date(),
      });

      // 🧹 cleanup temp cart anyway
      await cartRef.delete();

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`
      );
    }

    // ✅ Calculate totals
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = subtotal + (shippingCost || 0);

    // ✅ Generate custom LUM ID
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timePart = Date.now().toString().slice(-6);
    const orderId = `LUM-${randomPart}${timePart}`;

    // ✅ Save order
    await adminDB
      .collection("placedOrders")
      .doc(orderId)
      .set({
        userId,
        shippingInfo,
        cartItems,
        total,
        paymentStatus: "Paid",
        orderStatus: "Pending Verification",
        deliveryStatus: "Pending",
        paymentType: "Card/Stripe",
        estimatedDelivery: shippingMethod?.logisticAging || "Updating Shortly",
        shippingCost,
        shippingMethod,
        orderDate: new Date(),
      });

    // 🧹 Cleanup temp cart
    await cartRef.delete();

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}&method=Card/Stripe`
    );
  } catch (err) {
    console.error("❌ verify-payment error:", err);

    await adminDB.collection("failedOrders").doc(`fail_${Date.now()}`).set({
      reason: "Unexpected error",
      error: err.message,
      attemptedAt: new Date(),
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`
    );
  }
}
