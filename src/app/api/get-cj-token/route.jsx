// app/api/get-cj-token/route.js
export async function POST(req) {
  try {
    const response = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: process.env.Email_Key,
          password: process.env.CJ_PASSWORD,
        }),
      }
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching token", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
