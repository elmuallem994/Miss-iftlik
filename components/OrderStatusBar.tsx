// OrderStatusBar.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OrderType } from "@/app/types/types";
import { useOrderStore } from "@/utils/store";

const OrderStatusBar: React.FC = () => {
  const { orderId } = useOrderStore(); // الحصول على orderId من Zustand
  const [order, setOrder] = useState<OrderType | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // حالات الطلب ونماذج الحالات
  const statuses = ["Alındı", "hazırlanıyor", "Yolda", "teslim edildi"];
  const currentStatusIndex = statuses.indexOf(order?.status || "");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/${orderId}`
        );
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrder();

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!order || order.status === "teslim edildi") {
    return null;
  }

  // تحقق إذا كانت الصفحة الحالية هي صفحة تفاصيل الطلب
  if (pathname === `/order-details/${orderId}`) {
    return null; // لا تعرض المكون إذا كنت في صفحة تفاصيل الطلب
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:right-auto md:w-[300px] bg-white shadow-lg p-4 rounded-xl border border-gray-200 flex flex-col cursor-pointer"
      style={{ zIndex: 1000 }}
      onClick={() => router.push(`/order-details/${orderId}`)}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="w-3 h-3 rounded-full bg-orange-400 animate-pulsee"></span>
        <div className="flex gap-1 ml-2 flex-grow">
          {statuses.map((_, index) => (
            <span
              key={index}
              className={`h-1 w-full rounded-md ${
                index <= currentStatusIndex
                  ? "bg-orange-500 " +
                    (index === currentStatusIndex ? "animate-current-bar" : "")
                  : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>
      <div className="flex items-center">
        <div>
          <p className="text-gray-400 text-sm font-semibold">Miss Çiftlik</p>
          <p className="text-orange-600 text-base mt-1">
            {order.status === "hazırlanıyor" ? "Hazırlanıyor" : order.status}
          </p>
          {/* إضافة وصف عن حالة الطلب */}
          <p className="text-gray-500 text-xs mt-2">
            {order.status === "hazırlanıyor"
              ? "Siparişiniz şu anda hazırlanıyor ve kısa süre içinde hazır olacak."
              : order.status === "yolda"
              ? "Siparişiniz şu anda yolda. Harika bir deneyim diliyoruz."
              : order.status === "teslim edildi"
              ? "Siparişiniz başarıyla teslim edildi. Bizimle alışveriş yaptığınız için teşekkür ederiz!"
              : "Siparişiniz Alındı. Belirtilen günde teslim edilecektir"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusBar;
