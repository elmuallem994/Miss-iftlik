// app/order-details/[orderId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import OrderStatus from "@/components/orderStatus";
import { OrderType } from "../../types/types";
import Image from "next/image";
import { useLoadingStore } from "@/utils/store"; // استيراد useLoadingStore

const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = params;

  const [orderDetails, setOrderDetails] = useState<OrderType | null>(null);

  const setLoading = useLoadingStore((state) => state.setLoading); // تفعيل setLoading من store

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true); // تفعيل مؤشر التحميل عند بدء جلب البيانات
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/${orderId}`
        );
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false); // إيقاف مؤشر التحميل عند الانتهاء
      }
    };

    fetchOrderDetails();
  }, [orderId, setLoading]);

  if (!orderDetails) return <p>لم يتم العثور على الطلب.</p>;

  return (
    <div className="main-content p-6 max-w-2xl mx-auto mb-16 bg-white shadow-lg rounded-lg">
      {/* العنوان الرئيسي مع خلفية الخريطة وصورة الشركة */}
      <div className="relative bg-gray-200 rounded-xl w-full h-32 overflow-hidden shadow-lg mb-6">
        {/* الخلفية ذات طابع الخريطة */}
        <div className="absolute inset-0 opacity-30 ">
          <Image
            src="/mapp.png" // استبدل هذا بمسار صورة خريطة
            fill
            objectFit="cover"
            alt="Map Background"
          />
        </div>

        <div className="relative flex flex-col items-center justify-center gap-3 p-3 md:flex-row md:gap-6">
          {/* عنوان الحالة */}
          <h2 className="text-2xl md:text-3xl font-bold text-orange-500 text-center md:text-left pb-2">
            Siparişiniz {orderDetails.status}!
          </h2>
          <div className="w-64 md:w-72">
            {orderDetails.status && (
              <OrderStatus status={orderDetails.status} />
            )}
          </div>
        </div>
      </div>

      {/* الرسالة الأساسية */}
      <p className="text-gray-600 mb-6">
        <span className="font-semibold text-orange-600">
          {orderDetails.recipientInfo}
        </span>{" "}
        siparişinizi onayladı. Siparişiniz, belirttiğiniz tarihte teslim edilmek
        üzere hazırlanacaktır.
      </p>

      {/* الحالة */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-gray-700 font-semibold mb-2">
          Sınırlı Sipariş Takibi
        </h2>
        <p className="text-sm text-gray-600">
          Siparişiniz alınmıştır ve belirttiğiniz tarihte teslim edilmek üzere
          hazırlanmaktadır. Ürünlerimiz günlük olarak taze şekilde üretilir ve
          doğrudan kapınıza kadar ulaştırılır.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Herhangi bir yardıma mı ihtiyacınız var? Siparişinizin detaylarını ve
          teslimat sürecini takip etmek için bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      {/* تفاصيل الطلب */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <p className="text-gray-500 font-semibold mb-2 flex items-center gap-2">
          <strong className="text-orange-500">Sipariş Numarası:</strong>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm">
            #{orderDetails.id.replace(/\D/g, "").slice(-4)}
          </span>
        </p>

        <p className="text-gray-500 font-semibold mb-2">
          <strong className="text-orange-500">Sipariş Tarihi:</strong>
          <span className="ml-2">
            {new Date(orderDetails.createdAt).toLocaleDateString("tr-TR", {
              timeZone: "Asia/Istanbul",
            })}
          </span>
        </p>

        <p className="text-gray-500 font-semibold mb-2">
          <strong className="text-orange-500">Bölge:</strong>
          <span className="ml-2">
            {orderDetails.orderItems[0]?.regionName || "Bilgi Yok"} -
            {orderDetails.orderItems[0]?.neighborhoods || "Bilgi Yok"}
          </span>
        </p>

        <p className="text-gray-500 font-semibold mb-2">
          <strong className="text-orange-500 text-lg  ">Teslim Tarihi:</strong>
          <span className="ml-2">
            {orderDetails.deliveryDate
              ? new Date(orderDetails.deliveryDate).toLocaleDateString(
                  "tr-TR",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    timeZone: "Asia/Istanbul",
                  }
                )
              : "Teslim tarihi yok"}
          </span>
        </p>

        <p className="text-gray-500 font-bold mb-2">
          <strong className="text-orange-500 ">Zaman :</strong>
          <span className="ml-2">
            {orderDetails.orderItems[0]?.startTime || "Bilgi Yok"} -
            {orderDetails.orderItems[0]?.endTime || "Bilgi Yok"}
          </span>
        </p>
      </div>

      {/* قائمة المنتجات */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <h3 className="text-orange-400 font-semibold mb-2">Ürünler:</h3>
        <ul className="space-y-4">
          {orderDetails.orderItems.map((item) => (
            <li
              key={item.productId}
              className="bg-orange-100 rounded-md p-3 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0"
            >
              <div className="flex justify-between items-center md:block">
                <span className="font-bold text-orange-600">{item.title}</span>
              </div>
              <div className="text-gray-500 text-sm md:mr-4">
                Açıklama: {item.desc}
              </div>
              <div className="font-bold text-green-600 md:text-right">
                Adet: {item.quantity}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* المجموع الكلي */}
      <div className="bg-orange-50 p-4 rounded-lg text-green-600 font-bold text-lg md:text-xl shadow-inner text-center">
        <p>Toplam Tutar: {orderDetails.price} TL</p>
      </div>
    </div>
  );
};

export default OrderDetails;
