"use client";
import { useCartStore } from "@/utils/store";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const CartIcon = () => {
  const { user } = useUser(); // استخدم هوك Clerk لجلب المستخدم والتحقق من حالة المصادقة

  const { totalItems } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <Link href={user?.publicMetadata?.role === "admin" ? "/add" : "/cart"}>
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
        {user?.publicMetadata?.role === "admin" ? (
          <button className="p-1 bg-red-500 text-white rounded-md">
            Add product
          </button>
        ) : (
          <span>Cart ({totalItems})</span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;
