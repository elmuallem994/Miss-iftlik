"use client";
import { useCartStore } from "@/utils/store";
import { useUser } from "@clerk/nextjs";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

const CartIcon = () => {
  const { user } = useUser(); // استخدم هوك Clerk لجلب المستخدم والتحقق من حالة المصادقة
  const { totalItems } = useCartStore((state) => state);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <div className="relative">
      {user?.publicMetadata?.role === "admin" ? (
        <Link href="/admin">
          <Button
            variant="secondary"
            className="  text-base rounded-full font-bold bg-red-600 text-white"
          >
            المشرف
          </Button>
        </Link>
      ) : (
        <Link href="/cart">
          <div className="relative flex items-center bg-orange-400 p-2 md:py-1 rounded-full">
            <span className="text-white   mr-2  inline">Sepetim</span>
            <ShoppingCart className="text-white w-6 h-6 md:w-5 md:h-5" />

            {totalItems > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </div>
            )}
          </div>
        </Link>
      )}
    </div>
  );
};

export default CartIcon;
