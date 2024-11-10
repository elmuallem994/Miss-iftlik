import type { Metadata } from "next";

import LoadingHandler from "@/app/components/ui/loadingHandler";
import Notification from "./components/Notification";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./components/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { trTR } from "@clerk/localizations";
import OrderStatusBar from "@/components/OrderStatusBar";
import "./globals.css";
import CartIcon from "@/components/CartIcon";

export const metadata: Metadata = {
  title: "Miss Ciftlik",
  description: "Taze süt ve peynir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={trTR}>
      <QueryProvider>
        <html lang="tr">
          {/** bg-primary-black bg-gray-900 min-h-screen  text-secondary-white */}
          <body className="bg-gray-900 antialiased ">
            <div className="main-container ">
              <Notification />
              <Navbar />
              <OrderStatusBar />
              <LoadingHandler />
              <div className="content">{children}</div>
              <CartIcon /> {/* إضافة أيقونة السلة هنا */}
              <Footer />
            </div>
            <ToastContainer
              position="bottom-right"
              theme="dark"
              autoClose={3000}
            />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
