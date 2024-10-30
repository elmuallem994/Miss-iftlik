"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import CartIcon from "./CartIcon";
import UserLinks from "./UserLinks";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";

const links = [
  { id: 1, title: "Ana sayfa", url: "/" },
  { id: 2, title: "Menü", url: "/menu" },
  { id: 3, title: "Çalışma Saatleri", url: "/" },
  { id: 4, title: "Iletişim", url: "/" },
];

const Menu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="ml-auto mr-4 bg-orange-400 text-white"
        >
          <MenuIcon className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-orange-50 flex flex-col justify-between  w-80 p-6"
      >
        <div className="flex flex-col items-center gap-4">
          <SheetHeader>
            <SheetTitle className="text-center text-2xl">القائمة</SheetTitle>
          </SheetHeader>
          <Separator />
        </div>

        <div className="flex flex-col gap-4 items-center text-lg w-full max-w-xs mx-auto">
          {links.map((item) => (
            <Link
              href={item.url}
              key={item.id}
              className="hover:underline text-white bg-orange-400 text-center rounded-2xl py-1 w-full"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-row items-center justify-between gap-4">
          <UserLinks />
          <Link href="/cart">
            <CartIcon />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
