export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const vid = searchParams.get("vid");

  if (!vid) {
    return new Response(JSON.stringify({ error: "Missing vid" }), {
      status: 400,
    });
  }

  try {
    console.log("Fetching inventory for vid in api:", vid);
    const res = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/stock/queryByVid?vid=${vid}`,
      {
        method: "GET",
        headers: {
          "CJ-ACCESS-TOKEN": process.env.CJ_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch from CJ",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
