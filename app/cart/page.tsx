"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/utils/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { format, addDays, compareAsc, getDay } from "date-fns";

const CartPage = () => {
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);
  const [deliveryDates, setDeliveryDates] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // حالة الرسالة
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { isSignedIn, user } = useUser();

  const router = useRouter();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const calculateDeliveryDates = (days: string[]) => {
    const today = new Date();

    const dayMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const dates = days.map((day) => {
      const targetDay = dayMap[day];
      const todayDay = getDay(today);

      const dayDifference = (targetDay + 7 - todayDay) % 7;

      return addDays(today, dayDifference === 0 ? 7 : dayDifference);
    });

    return dates;
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        if (!selectedDay) {
          throw new Error("Please select a delivery day.");
        }

        const regionId = await fetchRegionId(); // جلب معرف المنطقة

        // جلب عنوان المستخدم من API (التحقق إذا كان العنوان موجودًا)
        const addressResponse = await fetch(
          `http://localhost:3000/api/address/${user?.id}`
        );
        const addressData = await addressResponse.json();
        const addressId = addressData?.addressId;

        if (!addressId) {
          throw new Error("Address ID is missing.");
        }

        // إرسال الطلب إلى API مع معلومات المستخدم الكاملة
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userData: {
              id: user.id, // معرف المستخدم
            },
            orderData: {
              price: totalPrice,
              products,
              status: "Pending",
              deliveryDay: `${format(selectedDay, "EEEE")} - ${format(
                selectedDay,
                "yyyy-MM-dd"
              )}`, // إرسال اليوم + التاريخ كـ string
              regionId: regionId, // إرسال معرف المنطقة
              addressId: addressId, // إرسال معرف العنوان
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

  const fetchRegionId = async () => {
    try {
      const addressResponse = await fetch(
        `http://localhost:3000/api/address/${user?.id}`
      );
      if (!addressResponse.ok) {
        throw new Error("Failed to fetch user address");
      }

      const addressData = await addressResponse.json();
      const regionId = addressData?.regionId;

      if (!regionId) {
        throw new Error("Region ID not found for the user");
      }

      return regionId;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchDeliveryDays = async () => {
    try {
      setLoading(true);
      setError(null);

      const regionId = await fetchRegionId();
      if (!regionId) {
        throw new Error("Region ID not available");
      }

      const response = await fetch(
        `http://localhost:3000/api/regions/${regionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch delivery days");
      }

      const data = await response.json();
      setDeliveryDays(data.deliveryDays);

      const calculatedDates = calculateDeliveryDates(data.deliveryDays);

      const sortedDates = calculatedDates.sort(compareAsc);
      setDeliveryDates(sortedDates);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-orange-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
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
          <span>Subtotal ({totalItems} items)</span>
          <span>${totalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Teslimat Ucreti</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>TOPLAM (KDV DAHİL)</span>
          <span className="font-bold">${totalPrice}</span>
        </div>

        {/* Alert Dialog لعرض الأيام المتاحة */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={fetchDeliveryDays}
              className="bg-orange-500 text-white p-3 rounded-md w-1/2 self-end mt-4"
            >
              {loading ? "Loading..." : "ONAYLA"} {/* زر لفتح النافذة */}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>اختر يوم التسليم</AlertDialogTitle>
              <AlertDialogDescription>
                اختر يوماً مناسباً من الأيام المتاحة للتسليم.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* عرض الأيام المتاحة تحت بعضها */}
            {deliveryDates.length > 0 ? (
              <div>
                {deliveryDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`day-${index}`}
                      name="deliveryDay"
                      value={date.toISOString()}
                      checked={
                        selectedDay?.toISOString() === date.toISOString()
                      }
                      onChange={() => {
                        setSelectedDay(date);
                        setError(null); // إخفاء الرسالة عند تحديد اليوم
                      }}
                    />
                    <label htmlFor={`day-${index}`}>
                      {`${format(date, "EEEE")} - ${format(
                        date,
                        "MMMM d, yyyy"
                      )}`}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>لم يتم العثور على أيام متاحة</p>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCheckout}
                disabled={!selectedDay}
              >
                تأكيد
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CartPage;
