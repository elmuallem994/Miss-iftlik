import type { Metadata } from "next";
import "./globals.css";
import Notification from "./components/Notification";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./components/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <body className=" antialiased">
            <Notification />
            <Navbar />
            {children}
            <Footer />
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
