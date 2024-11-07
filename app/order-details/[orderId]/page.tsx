// app/order-details/[orderId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/ui/loadingSpinner";
import OrderStatus from "@/components/orderStatus";
import { OrderType } from "../../types/types";
import Image from "next/image";

const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = params;

  const [orderDetails, setOrderDetails] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/${orderId}`
        );
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) return <LoadingSpinner />;

  if (!orderDetails) return <p>لم يتم العثور على الطلب.</p>;

  return (
    <div className="main-content p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
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
        {orderDetails.recipientInfo} siparişinizi onayladı, Siparişiniz,
        belirttiğiniz tarihte teslim edilmek üzere hazırlanacaktır.
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
        <p className="text-gray-800 font-semibold mb-2">
          <strong>Sipariş Numarası:</strong> {orderDetails.id}
        </p>
        <p className="text-gray-800 font-semibold mb-2">
          <strong>Sipariş Tarihi:</strong>{" "}
          {new Date(orderDetails.createdAt).toLocaleDateString("tr-TR", {
            timeZone: "Asia/Istanbul",
          })}
        </p>
      </div>

      {/* قائمة المنتجات */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <h3 className="text-gray-800 font-semibold mb-2">Ürünler:</h3>
        <ul className="list-disc ml-6 space-y-2">
          {orderDetails.orderItems.map((item) => (
            <li key={item.productId} className="text-gray-700">
              {item.title} - Miktar: {item.quantity} - Fiyat: {item.price} TL
            </li>
          ))}
        </ul>
      </div>

      {/* المجموع الكلي */}
      <div className="bg-orange-50 p-4 rounded-lg text-orange-600 font-bold text-lg shadow-inner text-center">
        <p>Toplam Tutar: {orderDetails.price} TL</p>
      </div>
    </div>
  );
};

export default OrderDetails;
