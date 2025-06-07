import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Poppins } from "next/font/google";
import { AppContextProvider } from "@/Context/AppContext";
import AutoSaveUser from "../../models/AutoSaveUser";
import CheckAdmin from "../../models/CheckAdmin";
import FetchProducts from "../../models/ProductsFetcher";
import { Toaster } from "react-hot-toast";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins", // Create CSS variable
});

export const metadata = {
  title: "Riwiyat",
  description: "The ultimate clothing brand",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={poppins.variable}>
        <body className={`antialiased`}>
          <AppContextProvider>
            <AutoSaveUser />
            <CheckAdmin />
            <FetchProducts />
            {children}
            <Toaster position="top-center" />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
