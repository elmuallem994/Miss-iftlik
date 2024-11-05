"use client";

import { useEffect, useState } from "react";
import { useCartStore, useLoadingStore } from "@/utils/store";
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
} from "@/app/components/ui/alert-dialog";
import { format, addDays, compareAsc, getDay } from "date-fns";
import LoadingSpinner from "@/app/components/ui/loadingSpinner";
import { Pencil } from "lucide-react";

const CartPage = () => {
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhone, setRecipientPhone] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);
  const [deliveryDates, setDeliveryDates] = useState<Date[]>([]);
  const [regionName, setRegionName] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null); // حالة لتخزين وقت البدء
  const [endTime, setEndTime] = useState<string | null>(null); // حالة لتخزين وقت الانتهاء
  const [fullAddress, setFullAddress] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { isSignedIn, user } = useUser();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const calculateDeliveryDates = (days: string[]) => {
    const today = new Date();
    const todayDay = getDay(today);

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
      const dayDifference = (targetDay + 7 - todayDay) % 7;
      return addDays(today, dayDifference === 0 ? 0 : dayDifference);
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

        setLoading(true);

        const regionData = await fetchRegionId();

        if (!regionData || !regionData.regionId) {
          throw new Error("Region ID is missing.");
        }

        const regionId = regionData.regionId;
        const startTime = regionData.startTime; // تأكد من إحضار startTime من regionData
        const endTime = regionData.endTime; // تأكد من إحضار endTime من regionData
        const regionName = regionData.regionName; // تأكد من إحضار startTime من regionData
        const neighborhoods = regionData.neighborhoods; // تأكد من إحضار endTime من regionData

        const addressResponse = await fetch(
          `http://localhost:3000/api/address/${user?.id}`
        );
        const addressData = await addressResponse.json();
        const addressId = addressData?.addressId;

        if (!addressId) {
          throw new Error("Address ID is missing.");
        }

        const recipientInfo = `${recipientName}\n${recipientPhone}`;

        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userData: {
              id: user.id,
            },
            orderData: {
              price: totalPrice,
              products: products.map((product) => ({
                id: product.id,
                title: product.title,
                desc: product.desc,
                img: product.img,
                quantity: product.quantity,
                price: product.price,
              })),
              status: "Alındı",
              deliveryDay: `${format(selectedDay, "EEEE")} - ${format(
                selectedDay,
                "yyyy-MM-dd"
              )}`,
              regionId: regionId,
              addressId: addressId,
              recipientInfo: recipientInfo,
              startTime: startTime,
              endTime: endTime,
              fullAddress: fullAddress, // إضافة العنوان الكامل
              regionName: regionName, // إضافة اسم المنطقة
              neighborhoods: neighborhoods, // إضافة أسماء الأحياء إذا كانت موجودة
            },
          }),
        });

        if (res.ok) {
          useCartStore.getState().clearCart();
          router.push("/success");
        } else {
          const errorData = await res.json();
          console.error("Error occurred during checkout:", errorData);
        }
      } catch (err) {
        console.error("Something went wrong during the checkout process:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchRegionId = async () => {
    try {
      const addressResponse = await fetch(
        `http://localhost:3000/api/address/${user?.id}`
      );
      if (!addressResponse.ok) {
        throw new Error("فشل في جلب عنوان المستخدم");
      }

      const addressData = await addressResponse.json();
      console.log("Address Data:", addressData);

      if (!addressData.regionId) {
        throw new Error("لم يتم العثور على معرف المنطقة لعنوان المستخدم");
      }

      return {
        fullAddress: `${addressData.il}, ${addressData.adres}`,
        regionId: addressData.regionId,
        startTime: addressData.startTime, // تأكد من جلب وقت البدء
        endTime: addressData.endTime, // تأكد من جلب وقت الانتهاء
        regionName: addressData.regionName,
        neighborhoods: addressData.neighborhoods,
      };
    } catch (error) {
      console.log(error);
      setError(error.message);
      return null;
    }
  };

  const fetchDeliveryDays = async () => {
    if (!isSignedIn) {
      setMessage("يرجى تسجيل الدخول للمتابعة.");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const addressData = await fetchRegionId();
      if (!addressData) {
        setMessage("يرجى إضافة عنوان للمتابعة.");
        setTimeout(() => {
          router.push("/address");
        }, 1000);
        return;
      }

      const { fullAddress, regionId } = addressData;
      setFullAddress(fullAddress);

      const response = await fetch(
        `http://localhost:3000/api/regions/${regionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch delivery days");
      }

      const data = await response.json();
      setDeliveryDays(data.deliveryDays);

      // إضافة startTime و endTime إلى الحالة
      setRegionName(`${data.regionName} - ${data.neighborhoods}`);
      setStartTime(data.startTime); // حفظ وقت البدء
      setEndTime(data.endTime); // حفظ وقت الانتهاء

      const calculatedDates = calculateDeliveryDates(data.deliveryDays);
      const sortedDates = calculatedDates.sort(compareAsc);
      setDeliveryDates(sortedDates);
    } catch (error) {
      setError(error.message || "حدث خطأ أثناء جلب أيام التوصيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-orange-500 lg:flex-row">
      {message && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-red-500 text-white text-center p-8 z-50 rounded-md">
          {message}
        </div>
      )}

      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {products.map((item) => (
          <div className="flex items-center justify-between mb-4" key={item.id}>
            {item.img && (
              <Image src={item.img} alt="" width={100} height={100} />
            )}
            <div className="">
              <h1 className="uppercase text-xl font-bold">
                {item.title} {item.desc} x{item.quantity}
              </h1>
              <span>{item.optionTitle}</span>
            </div>
            <h2 className="font-bold">{item.price} TL</h2>
            <span
              className="cursor-pointer"
              onClick={() => removeFromCart(item)}
            >
              X
            </span>
          </div>
        ))}
      </div>

      <div className="h-1/2 p-4 bg-orange-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span>{totalPrice} TL</span>
        </div>
        <div className="flex justify-between">
          <span>Teslimat Ucreti</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>TOPLAM (KDV DAHİL)</span>
          <span className="font-bold">{totalPrice} TL</span>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={fetchDeliveryDays}
              className="bg-orange-500 text-white p-3 rounded-md w-1/2 self-end mt-4"
            >
              DEVAM ET
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>اختر يوم التسليم</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 mt-4">
                {regionName && (
                  <p className="text-lg font-semibold">المنطقة: {regionName}</p>
                )}
                {startTime && endTime && (
                  <p className="text-sm text-gray-600">
                    وقت التسليم: {startTime} - {endTime}
                  </p>
                )}
                {fullAddress ? (
                  <div className="flex items-start justify-between space-y-2">
                    <p className="text-gray-800 border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 leading-relaxed">
                      {fullAddress}
                    </p>

                    <button
                      className="bg-gray-200 p-1 rounded-md ml-4 hover:bg-gray-300 transition-colors"
                      onClick={() => router.push("/address")}
                    >
                      <Pencil className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <p className="text-red-500">
                    العنوان: لم يتم العثور على عنوان كامل
                  </p>
                )}
                <p className="text-sm text-gray-600 pt-3 ">
                  اختر يوماً مناسباً من الأيام المتاحة للتسليم.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      اسم المستلم
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg w-full p-2"
                      placeholder="أدخل اسم المستلم"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      رقم المستلم
                    </label>
                    <input
                      type="tel"
                      className="border border-gray-300 rounded-lg w-full p-2"
                      placeholder="أدخل رقم المستلم"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            {isLoading ? (
              <div className="flex justify-center items-center p-4 ">
                <LoadingSpinner />
              </div>
            ) : deliveryDates.length > 0 ? (
              <div>
                {deliveryDates.map((date, index) => {
                  const todayDay = getDay(new Date());
                  const isToday = getDay(date) === todayDay;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3  my-4  ${
                        isToday ? "bg-red-100 text-red-600" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        id={`day-${index}`}
                        name="deliveryDay"
                        value={date.toISOString()}
                        checked={
                          selectedDay?.toISOString() === date.toISOString()
                        }
                        onChange={() => {
                          if (!isToday) {
                            setSelectedDay(date);
                            setError(null);
                          } else {
                            setError(
                              "لا يمكنك تحديد اليوم الحالي كموعد للتسليم"
                            );
                          }
                        }}
                        disabled={isToday}
                      />
                      <label
                        htmlFor={`day-${index}`}
                        className="flex items-center gap-2"
                      >
                        {isToday && (
                          <span className="text-xs text-red-600 font-bold">
                            Bugün
                          </span>
                        )}
                        {`${format(date, "EEEE")} - ${format(
                          date,
                          "MMMM d, yyyy"
                        )}`}
                        {isToday && (
                          <span className="text-xs text-red-600 whitespace-normal break-words">
                            Aynı gün rezervasyon yapılması mümkün değildir.
                          </span>
                        )}
                      </label>
                    </div>
                  );
                })}
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
