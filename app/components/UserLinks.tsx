"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const UserLinks = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div>
      {/* إذا كان المستخدم مسجل دخوله */}
      <SignedIn>
        <div className="flex items-center justify-center">
          <Link className="mr-4" href="/orders" onClick={onClick}>
            Siparişlerim
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
            Giriş
          </span>
        </SignInButton>
      </SignedOut>
    </div>
  );
};

export default UserLinks;
