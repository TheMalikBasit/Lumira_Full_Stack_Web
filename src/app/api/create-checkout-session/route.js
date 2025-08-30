import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "../../../../Config/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, userId, shippingInfo, shippingCost, shippingMethod } = body;

    if (
      !userId ||
      !items?.length ||
      !shippingInfo ||
      shippingCost == null ||
      !shippingMethod
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Save temp cart with Admin SDK
    const tempCartRef = adminDB
      .collection("tempCarts")
      .doc(`cart_${Date.now()}_${userId}`);
    await tempCartRef.set({
      userId,
      items,
      shippingInfo,
      shippingCost,
      shippingMethod,
      createdAt: new Date(),
    });

    // ✅ Stripe line items
    const lineItems = [
      ...items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Unknown Product",
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping Cost" },
          unit_amount: Math.round(Number(shippingCost) * 100),
        },
        quantity: 1,
      },
    ];

    // ✅ Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-checkout`,
      metadata: {
        userId,
        cartRefId: tempCartRef.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ create-checkout-session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
