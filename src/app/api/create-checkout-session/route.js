// app/api/create-checkout-session/route.js

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, userId, shippingInfo } = body;

    if (!userId || !items || !shippingInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || "Unknown Product",
        },
        unit_amount: item.price, // price is already in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-checkout`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "PK", "OM"],
      },
      metadata: {
        userId,
        shippingInfo: JSON.stringify({
          FirstName: shippingInfo.FirstName,
          LastName: shippingInfo.LastName,
          Email: shippingInfo.Email,
          Phone: shippingInfo.Phone,
          FullAddress: shippingInfo.FullAddress,
          City: shippingInfo.City,
          State: shippingInfo.State,
          Country: shippingInfo.Country,
          ZipCode: shippingInfo.ZipCode,
        }),

        cartItems: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
