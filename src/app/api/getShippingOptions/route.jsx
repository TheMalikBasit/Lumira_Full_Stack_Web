// app/api/getShippingOptions/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime
export const dynamic = "force-dynamic"; // avoid caching

const CJ_ENDPOINT =
  "https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate";

export async function POST(req) {
  try {
    const { code, items, startCountryCode = "CN" } = await req.json();

    if (!process.env.CJ_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "CJ_ACCESS_TOKEN is not set on the server" },
        { status: 500 }
      );
    }

    if (!code || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error:
            "Country code (ISO-2) and a non-empty items array are required",
        },
        { status: 400 }
      );
    }

    // CJ expects a two-letter ISO country code, e.g. "PK"
    const endCountryCode = String(code).trim().toUpperCase();

    const results = [];

    for (const item of items) {
      const vid = item.vid || item.variantId; // must be the CJ variant ID
      const quantity = Number(item.quantity ?? 1);

      if (!vid) {
        results.push({ error: "Missing CJ vid on item", item });
        continue;
      }

      const res = await fetch(CJ_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CJ-Access-Token": process.env.CJ_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          startCountryCode, // usually "CN" unless you route from other warehouses
          endCountryCode, // destination ISO-2 (e.g., "PK")
          products: [{ vid, quantity }],
        }),
        cache: "no-store",
      });

      const data = await res.json();

      // Some CJ endpoints return { result: true }, others { success: true }.
      if ((data?.result || data?.success) && Array.isArray(data?.data)) {
        // Normalize/keep useful fields; docs use `logisticName`, some payloads use `logisticsName`
        const methods = data.data.map((m) => ({
          logisticsName: m.logisticsName || m.logisticName,
          logisticName: m.logisticName || m.logisticsName, // keep both for safety
          logisticAging: m.logisticAging,
          logisticPrice: Number(m.logisticPrice),
          logisticPriceCn:
            m.logisticPriceCn != null ? Number(m.logisticPriceCn) : null,
          taxesFee: m.taxesFee ?? null,
          clearanceOperationFee: m.clearanceOperationFee ?? null,
          totalPostageFee: m.totalPostageFee ?? null,
        }));

        results.push({ vid, shippingMethods: methods });
      } else {
        results.push({
          vid,
          error: data?.message || "CJ API error",
          requestId: data?.requestId || null,
          raw: data,
        });
      }
    }

    // Build intersection only from successful items
    const methodLists = results
      .filter((r) => Array.isArray(r.shippingMethods))
      .map((r) => r.shippingMethods);

    let common = [];
    if (methodLists.length > 0) {
      // Intersect by logistics name
      common = methodLists[0].filter((m1) =>
        methodLists.every((list) =>
          list.some(
            (m2) =>
              (m2.logisticsName || m2.logisticName) ===
              (m1.logisticsName || m1.logisticName)
          )
        )
      );

      // De-duplicate by name + normalize `logisticsName`
      const seen = new Set();
      common = common.filter((m) => {
        const name = m.logisticsName || m.logisticName;
        if (seen.has(name)) return false;
        seen.add(name);
        if (!m.logisticsName && m.logisticName)
          m.logisticsName = m.logisticName;
        return true;
      });
    }

    return NextResponse.json({
      perProduct: results, // array per vid with its methods (or an error for that vid)
      common, // intersection across all successful items
    });
  } catch (err) {
    console.error("Error in getShippingOptions API:", err);
    return NextResponse.json(
      { error: "Failed to fetch shipping options" },
      { status: 500 }
    );
  }
}
