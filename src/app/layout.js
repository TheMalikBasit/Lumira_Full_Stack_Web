import ClerkFirebaseBridge from "../../Config/ClerkFirebaseBridge";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Poppins } from "next/font/google";
import { AppContextProvider } from "@/Context/AppContext";
import AutoSaveUser from "../../models/AutoSaveUser";
import CheckAdmin from "../../models/CheckAdmin";
import FetchProducts from "../../models/ProductsFetcher";
import { Toaster } from "react-hot-toast";
import CurrencyFetcher from "../../models/CurrencyFetcher";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins", // Create CSS variable
});

export const metadata = {
  title: "Lumira",
  description: "The Luxurious Lamps and Lighting Store",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={poppins.variable}>
        <body className={`antialiased`}>
          <AppContextProvider>
            <ClerkFirebaseBridge />
            <AutoSaveUser />
            <CheckAdmin />
            <FetchProducts />
            <CurrencyFetcher />
            {children}
            <SpeedInsights />
            <Analytics />
            <Toaster position="top-center" />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
