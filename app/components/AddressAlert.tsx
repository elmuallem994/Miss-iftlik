// components/AddressAlert.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const AddressAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    // دالة التحقق من وجود عنوان
    const checkAddress = async () => {
      if (isSignedIn && user?.publicMetadata?.role !== "admin") {
        // التحقق إذا لم يكن المستخدم مشرفًا
        try {
          const res = await fetch("http://localhost:3000/api/address");
          const data = await res.json();
          if (!data || data.length === 0) {
            setShowAlert(true);
          }
        } catch (error) {
          console.error("Error checking address:", error);
        }
      }
    };

    checkAddress();
  }, [isSignedIn, user]);

  // إخفاء التنبيه إذا كانت الصفحة الحالية هي "/address" أو إذا كان المستخدم مشرفًا
  if (!showAlert || pathname === "/address") return null;

  return (
    <div className=" text-white text-center p-3 animate-blink">
      <Link href="/address">
        <span className="font-semibold hover:underline">
          Henüz bir başlık eklemediniz! Devam etmek için lütfen adresinizi
          ekleyin.
        </span>
      </Link>
    </div>
  );
};

export default AddressAlert;
