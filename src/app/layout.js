import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppContextProvider } from "@/Context/AppContext";
import AutoSaveUser from "../../models/AutoSaveUser";
import CheckAdmin from "../../models/CheckAdmin";
export const metadata = {
  title: "The Forever Bottle",
  description: "A sustainable water bottle for all your adventures",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <AppContextProvider>
            <AutoSaveUser />
            <CheckAdmin />
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
