// OrderStatusBar.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OrderType } from "@/app/types/types";
import { useOrderStore } from "@/utils/store";

const OrderStatusBar: React.FC = () => {
  const { orderIds, removeOrderId } = useOrderStore(); // احصل على قائمة الطلبات ودالة الإزالة
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState<{
    [key: string]: boolean;
  }>({}); // حالة لحفظ الطي/التوسيع لكل طلب
  const router = useRouter();
  const pathname = usePathname();

  // حالات الطلب ونماذج الحالات
  const statuses = ["Alındı", "hazırlanıyor", "Yolda", "teslim edildi"];

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders: OrderType[] = [];

      for (const orderId of orderIds) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/orders/${orderId}`
          );
          if (response.ok) {
            const data = await response.json();
            fetchedOrders.push(data);
          } else if (response.status === 404) {
            console.warn("Order not found, removing from order list.");
            removeOrderId(orderId);
          }
        } catch (error) {
          console.error("Error fetching order status:", error);
        }
      }

      setOrders(fetchedOrders);
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 5000); // تحديث الطلبات كل 5 ثوانٍ
    return () => clearInterval(interval);
  }, [orderIds, removeOrderId]);

  // إخفاء جميع البطاقات إذا كانت الصفحة الحالية هي صفحة تفاصيل الطلب
  if (pathname.includes("/order-details/")) {
    return null;
  }

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div
      className="fixed bottom-20 left-4 right-4 md:right-auto md:w-[300px] flex flex-col gap-4"
      style={{ zIndex: 1000 }}
    >
      {orders.map((order) => {
        const currentStatusIndex = statuses.indexOf(order.status || "");

        // إخفاء البطاقة إذا كانت حالة الطلب "teslim edildi"
        if (order.status === "teslim edildi") {
          return null;
        }

        return (
          <div
            key={order.id}
            className="bg-white shadow-lg p-4 rounded-xl border border-gray-200 cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => toggleExpand(order.id)} // عكس حالة الطي عند النقر
          >
            {/* عرض رقم الطلب */}
            <p className="text-xs text-gray-500 font-bold pb-2">
              Sipariş Numarası:{" "}
              <span className="px-3 rounded-full bg-blue-100 text-blue-800 font-semibold">
                # {order.id.replace(/\D/g, "").slice(-4)}
              </span>
            </p>

            <div className="flex items-center justify-between mb-3">
              <span className="w-3 h-3 rounded-full bg-orange-400 animate-pulsee"></span>
              <div className="flex gap-1 ml-2 flex-grow">
                {statuses.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1 w-full rounded-md ${
                      index <= currentStatusIndex
                        ? "bg-orange-500 " +
                          (index === currentStatusIndex
                            ? "animate-current-bar"
                            : "")
                        : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <p className="text-orange-600 text-base">
                {order.status === "hazırlanıyor"
                  ? "Hazırlanıyor"
                  : order.status}
              </p>
            </div>

            {/* عرض التفاصيل عند توسيع البطاقة فقط */}
            {expandedOrderIds[order.id] && (
              <div className="text-gray-500 text-xs mt-2">
                <p>
                  {order.status === "hazırlanıyor"
                    ? "Siparişiniz şu anda hazırlanıyor ve kısa süre içinde hazır olacak."
                    : order.status === "yolda"
                    ? "Siparişiniz şu anda yolda. Harika bir deneyim diliyoruz."
                    : order.status === "teslim edildi"
                    ? "Siparişiniz başarıyla teslim edildi. Bizimle alışveriş yaptığınız için teşekkür ederiz!"
                    : "Siparişiniz Alındı. Belirtilen günde teslim edilecektir"}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // لمنع إعادة توجيه الصفحة عند النقر على الزر
                    router.push(`/order-details/${order.id}`);
                  }}
                  className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                >
                  Daha fazlasını gör
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusBar;
