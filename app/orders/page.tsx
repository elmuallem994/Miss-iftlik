"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderType } from "../types/types";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import LoadingSpinner from "@/app/components/ui/loadingSpinner";
import OrderStatus from "@/components/orderStatus";

const OrdersPage = () => {
  const { user } = useUser();

  // التحقق مما إذا كان المستخدم مشرفًا
  const role = user?.publicMetadata?.role === "admin";

  const { isPending, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/orders").then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("تم تحديث حالة الطلب بنجاح!");
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const select = form.elements[0] as HTMLSelectElement;
    const status = select.value || "Alındı"; // تعيين الحالة الافتراضية

    mutation.mutate({ id, status });
  };

  if (isPending) return <LoadingSpinner />;

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-4 lg:px-20 xl:px-40 main-content text-white min-h-screen w-[90%] sm:w-[85%] md:w-[75%]">
        <h1 className="glowing-text text-center text-3xl sm:text-4xl text-white font-extralight mb-6 sm:mb-12">
          Siparişlerim
        </h1>

        {data.map((item: OrderType) => (
          <div
            key={item.id}
            className="mb-9 border border-orange-300 rounded-xl bg-orange-50 p-4 sm:p-6"
          >
            {/* القسم العلوي: يحتوي على المعلومات على اليسار والمنتجات على اليمين */}
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              {/* القسم اليساري: تفاصيل الطلب */}
              <div className="sm:w-1/2 w-full">
                <p className="text-orange-600 font-bold text-lg mb-2">
                  Order ID:{" "}
                  <span className="text-gray-700">
                    #{item.id.replace(/\D/g, "").slice(-4)}
                  </span>
                </p>
                <div className="flex p-2">
                  <p className="text-orange-600 font-semibold w-24 sm:w-32">
                    تاريخ الطلب:
                  </p>
                  <p className="text-gray-700">
                    {item.createdAt.toString().slice(0, 10)}
                  </p>
                </div>
                <div className="flex p-2">
                  <p className="text-orange-600 font-semibold w-24 sm:w-32">
                    تاريخ التسليم:
                  </p>
                  <p className="text-gray-700">{item.deliveryDate}</p>
                </div>
                <div className="flex p-2">
                  <p className="text-orange-600 font-semibold w-24 sm:w-32">
                    معلومات المستلم:
                  </p>
                  <p className="text-gray-700">{item.recipientInfo}</p>
                </div>
                <div className="flex p-2">
                  <p className="text-orange-600 font-semibold w-24 sm:w-32">
                    المنطقة:
                  </p>
                  <p className="text-gray-700">
                    {item.orderItems[0]?.regionName || "غير متوفر"} -{" "}
                    {item.orderItems[0]?.neighborhoods || "غير متوفر"}
                  </p>
                </div>

                <div className="flex p-2">
                  <p className="text-orange-600 font-semibold w-24 sm:w-32">
                    الوقت:
                  </p>
                  <p className="text-gray-700">
                    {item.orderItems[0]?.startTime || "غير متوفر"} -{" "}
                    {item.orderItems[0]?.endTime || "غير متوفر"}
                  </p>
                </div>

                {role && (
                  <>
                    <div className="flex p-2">
                      <p className="text-orange-600 font-semibold w-24 sm:w-32">
                        معلومات المستخدم:
                      </p>
                      <p className="text-gray-700">{item.user.name}</p>
                    </div>
                    <div className="flex p-2">
                      <p className="text-orange-600 font-semibold w-24 sm:w-32">
                        البريد الإلكتروني:
                      </p>
                      <p className="text-gray-500">{item.user.email}</p>
                    </div>
                    <div className="flex p-2">
                      <p className="text-orange-600 font-semibold w-24 sm:w-32">
                        الهاتف:
                      </p>
                      <p className="text-gray-700">{item.user.phoneNumber}</p>
                    </div>
                    <div className="flex p-2">
                      <p className="text-orange-600 font-semibold w-24 sm:w-32">
                        العنوان:
                      </p>
                      <p className="text-gray-700">
                        {item.orderItems[0]?.address || "غير متوفر"}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* القسم اليميني: قائمة المنتجات */}
              <div className="w-full sm:w-1/2 border-t sm:border-l sm:border-t-0 border-orange-300 pl-0 sm:pl-4 pt-4 sm:pt-0">
                <h2 className="text-orange-600 font-semibold mb-4">المنتجات</h2>
                {item.orderItems.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold bg-orange-600 text-orange-50 rounded-full mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-700">
                          {product.title}
                        </p>
                        <p
                          className="text-gray-500 text-sm mt-1"
                          title={product.desc}
                        >
                          {product.desc.length > 30
                            ? `${product.desc.slice(0, 30)}...`
                            : product.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-orange-600">
                      Adet: {product.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* القسم السفلي: يحتوي على السعر وحالة الطلب مع إعدادات التحديث للمشرف */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 border-t border-orange-300 pt-4 ">
              <div className="text-green-600 text-xl sm:text-2xl font-semibold mb-8 md:mb-0">
                {item.price} TL
              </div>
              {role ? (
                <form
                  onSubmit={(e) => handleUpdate(e, item.id)}
                  className="flex items-center gap-2 mt-3 sm:mt-0"
                >
                  <select
                    className="w-36 p-1 bg-gray-200 text-gray-800 border border-gray-500 rounded-md"
                    defaultValue={item.status || "Alındı"}
                  >
                    <option value="Alındı"> Alındı</option>
                    <option value="hazırlanıyor"> Hazırlanıyor</option>
                    <option value="Yolda"> Yolda </option>
                    <option value="teslim edildi">teslim edildi</option>
                  </select>

                  <button className="p-3 text-white bg-orange-500 rounded-full hover:bg-orange-600">
                    حفظ
                  </button>
                </form>
              ) : (
                <div className=" w-full md:w-[38%] font-medium text-gray-600">
                  <OrderStatus status={item.status} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
