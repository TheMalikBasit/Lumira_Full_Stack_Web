// /app/api/calculate-shipping/route.js (Next.js 13/14)
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { queryCode, zipCode, variantId, quantity } = await req.json();

    const res = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate",
      {
        method: "POST",
        headers: {
          "CJ-Access-Token": process.env.CJ_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startCountryCode: "CN", // usually China
          endCountryCode: queryCode, // e.g. "US", "PK"
          products: [
            {
              vid: variantId, // ✅ CJ Variant ID
              quantity: quantity || 1,
            },
          ],
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Shipping calc error:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping" },
      { status: 500 }
    );
  }
}
