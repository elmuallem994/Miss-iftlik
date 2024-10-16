"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    // يمكنك وضع أي طلب آخر هنا إذا كنت بحاجة إلى تحديث حالة معينة في قاعدة البيانات
    setTimeout(() => {
      router.push("/orders"); // توجيه المستخدم إلى صفحة أخرى بعد 5 ثوانٍ
    }, 5000);
  }, [router]);

  return (
    <>
      <div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex items-center justify-center text-center text-2xl text-green-700">
        <p className="max-w-[600px]">
          تم إرسال طلبك بنجاح. سيتم تحويلك إلى صفحة الطلبات. الرجاء عدم إغلاق
          الصفحة.
        </p>
        <ConfettiExplosion className="absolute m-auto" />
      </div>
    </>
  );
};

export default SuccessPage;
