"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/utils/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  // تعريف المتغيرات المختارة للمنطقة وتاريخ التوصيل
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<
    string | null
  >(null);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        // جلب بيانات المستخدم
        const userData = {
          id: user?.id || "Unknown ID", // جلب معرف المستخدم من Clerk
          name: user?.fullName || "Unknown Name",
          email: user?.emailAddresses?.[0]?.emailAddress || "Unknown Email",
          phoneNumber: user?.phoneNumbers?.[0]?.phoneNumber || "Unknown Phone",
          address: user?.publicMetadata?.address || "Unknown Address",
        };

        // إرسال الطلب إلى الخادم لحفظ بيانات المستخدم والطلب
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userData, // إرسال بيانات المستخدم
            orderData: {
              price: totalPrice,
              products,
              regionId: selectedRegionId || null,
              deliveryDate: selectedDeliveryDate || null,
              status: "Pending",
            },
          }),
        });

        if (res.ok) {
          useCartStore.getState().clearCart(); // دالة تصفير السلة
          router.push("/success");
        } else {
          const errorData = await res.json();
          console.error("Error occurred during checkout:", errorData);
        }
      } catch (err) {
        console.error("Something went wrong during the checkout process:", err);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-orange-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {/* SINGLE ITEM */}
        {products.map((item) => (
          <div className="flex items-center justify-between mb-4" key={item.id}>
            {item.img && (
              <Image src={item.img} alt="" width={100} height={100} />
            )}
            <div className="">
              <h1 className="uppercase text-xl font-bold">
                {item.title} x{item.quantity}
              </h1>
              <span>{item.optionTitle}</span>
            </div>
            <h2 className="font-bold">${item.price}</h2>
            <span
              className="cursor-pointer"
              onClick={() => removeFromCart(item)}
            >
              X
            </span>
          </div>
        ))}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-orange-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal ({totalItems} items)</span>
          <span className="">${totalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span className="">Teslimat Ucreti</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOPLAM (KDV DAHİL)</span>
          <span className="font-bold">${totalPrice}</span>
        </div>

        {/* اختيار المنطقة */}
        <div className="mt-4">
          <label className="block mb-2">اختر المنطقة:</label>
          <select
            className="p-2 border rounded"
            value={selectedRegionId || ""}
            onChange={(e) => setSelectedRegionId(Number(e.target.value))}
          >
            <option value="">اختر المنطقة</option>
            <option value={1}>المنطقة 1</option>
            <option value={2}>المنطقة 2</option>
            {/* أضف المزيد من الخيارات حسب الحاجة */}
          </select>
        </div>

        {/* اختيار تاريخ التوصيل */}
        <div className="mt-4">
          <label className="block mb-2">اختر تاريخ التوصيل:</label>
          <input
            type="date"
            className="p-2 border rounded"
            value={selectedDeliveryDate || ""}
            onChange={(e) => setSelectedDeliveryDate(e.target.value)}
          />
        </div>

        <button
          className="bg-orange-500 text-white p-3 rounded-md w-1/2 self-end mt-4"
          onClick={handleCheckout}
        >
          ONAYLA
        </button>
      </div>
    </div>
  );
};

export default CartPage;
