import type { Metadata } from "next";
import "./globals.css";
import Notification from "./components/Notification";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
    <html lang="en">
      <body className=" antialiased">
        <Notification />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
