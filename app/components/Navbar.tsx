// Navbar.tsx
"use client";

import Link from "next/link";

import CartIcon from "./CartIcon";
import Image from "next/image";
import UserLinks from "./UserLinks";
import { Search } from "lucide-react";
import Menu from "./Menu";

const Navbar = () => {
  return (
    <div className="absolute top-20 md:top-16 left-0 w-full z-10 bg-transparent h-16 md:h-20 md:px-4  flex items-center justify-between md:justify-center md:gap-14">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={120} height={60} />
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex justify-center items-center gap-4  text-white ">
        <Link href="/" className="bg-orange-400 rounded-2xl py-1 px-3">
          Anasayfa
        </Link>
        <Link href="/" className="bg-orange-400 rounded-2xl py-1 px-3">
          Hakkımızda
        </Link>
        <Link href="/menu" className="bg-orange-400 rounded-2xl py-1 px-3">
          Ürünler
        </Link>
        <Link href="/" className="bg-orange-400 rounded-2xl py-1 px-3">
          Çiftliğimiz
        </Link>
      </div>

      {/* Right Links */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md">
          <input
            type="text"
            placeholder="Ürün arayın..."
            className="outline-none text-black px-4 py-2 w-full"
          />
          <div className="  bg-orange-400 px-4 py-2 cursor-pointer">
            <button>
              <Search className="text-white" size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Include the icons such as User, Favorite, and Cart */}
          <UserLinks />
          <CartIcon />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Menu />
      </div>
    </div>
  );
};

export default Navbar;
