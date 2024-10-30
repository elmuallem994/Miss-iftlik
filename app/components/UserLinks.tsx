"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ReceiptText, User } from "lucide-react";
import Link from "next/link";

const UserLinks = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="mx-6">
      {/* إذا كان المستخدم مسجل دخوله */}
      <SignedIn>
        <div className="flex items-center justify-center">
          {/* استخدام Link مع onClick */}
          <Link
            href="/orders"
            onClick={onClick}
            className="mr-4 flex items-center text-white bg-orange-400 rounded-2xl py-1 px-3"
          >
            <ReceiptText className="text-white icon-bell-ring" size={20} />
            <span className="ml-2  inline">Siparişlerim</span>
          </Link>

          {/* زر UserButton لعرض معلومات المستخدم وزر تسجيل الخروج */}
          <UserButton />
        </div>
      </SignedIn>

      {/* إذا كان المستخدم غير مسجل دخوله */}
      <SignedOut>
        {/* زر تسجيل الدخول مع نافذة منبثقة */}
        <SignInButton mode="modal">
          <span style={{ cursor: "pointer" }} onClick={onClick}>
            <User className="text-white" size={20} /> {/* استخدام الأيقونة */}
          </span>
        </SignInButton>
      </SignedOut>
    </div>
  );
};

export default UserLinks;
