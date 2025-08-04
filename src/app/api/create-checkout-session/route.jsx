// pages/api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { items, userId, shippingInfo } = req.body;

    // Create a line_items array for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || "Unknown Product",
        },
        unit_amount: item.price * 100, // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-checkout`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "PK", "OM"],
      },
      metadata: {
        userId,
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
