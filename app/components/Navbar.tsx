// Navbar.tsx
"use client";

import Link from "next/link";
import Menu from "./Menu";
import CartIcon from "./CartIcon";
import Image from "next/image";
import UserLinks from "./UserLinks";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/utils/store";

const Navbar = () => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const handleNavigation = async (url: string) => {
    try {
      setLoading(true); // Activate loading state
      await router.push(url); // Wait for navigation to complete
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setLoading(false); // Deactivate loading state
    }
  };

  return (
    <div className="h-12 text-orange-500 p-4 flex items-center justify-between border-b-2 border-b-orange-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* Left Links */}
      <div className="hidden md:flex gap-4 flex-1">
        {/* Include href and prevent default action in onClick */}
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/");
          }}
        >
          Ana sayfa
        </Link>
        <Link
          href="/menu"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/menu");
          }}
        >
          Menü
        </Link>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/");
          }}
        >
          İletişim
        </Link>
      </div>

      {/* Logo */}
      <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/");
          }}
        >
          Miss çiftlik
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Menu />
      </div>

      {/* Right Links */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <div className="md:absolute top-3 right-2 lg:static flex items-center gap-2 cursor-pointer bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20} />
          <span>123 456 78</span>
        </div>
        <UserLinks />
        <CartIcon />
      </div>
    </div>
  );
};

export default Navbar;
