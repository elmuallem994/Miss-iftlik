import type { Metadata } from "next";
import LoadingHandler from "@/app/components/ui/loadingHandler";
import Notification from "./components/Notification";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./components/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

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
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          {/** bg-primary-black text-secondary-white */}
          <body className="bg-primary-black antialiased">
            <div className="main-container">
              <Notification />
              <Navbar />
              <LoadingHandler />
              <div className="content">{children}</div>
              <Footer className="footer" />
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
