import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppContextProvider } from "@/Context/AppContext";
import AutoSaveUser from "../../models/AutoSaveUser";
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
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
