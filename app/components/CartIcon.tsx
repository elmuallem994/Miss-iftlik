"use client";
import { useCartStore } from "@/utils/store";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const CartIcon = () => {
  const { user } = useUser(); // استخدم هوك Clerk لجلب المستخدم والتحقق من حالة المصادقة
  const { totalItems } = useCartStore((state) => state);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <div className="relative">
      {user?.publicMetadata?.role === "admin" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Admin Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/add">Add Product</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/addCategoryForm">Add Category</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/regions">Add Regions</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/cart">
          <div className="flex items-center gap-4">
            <div className="relative w-8 h-8 md:w-5 md:h-5">
              <Image
                src="/cart.png"
                alt="Cart Icon"
                fill
                sizes="100%"
                className="object-contain"
              />
            </div>
            <div className="cart-icon">
              <span className="icon">🛒</span>
              <span className="cart-count">({totalItems})</span>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default CartIcon;
