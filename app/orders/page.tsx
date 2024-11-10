"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderType } from "../types/types";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import LoadingSpinner from "@/app/components/ui/loadingSpinner";
import OrderStatus from "@/components/orderStatus";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/app/components/ui/alert-dialog";
import { FaEye } from "react-icons/fa";

const OrdersPage = () => {
  const { user } = useUser();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // حالة البحث
  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const ordersPerPage = 10; // عدد الطلبات في الصفحة الواحدة

  // التحقق مما إذا كان المستخدم مشرفًا
  const role = user?.publicMetadata?.role === "admin";

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/orders")
        .then((res) => res.json())
        .then((orders) =>
          orders.sort(
            (a: OrderType, b: OrderType) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        ), // ترتيب تنازلي حسب createdAt
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>حدث خطأ أثناء جلب البيانات.</p>;

  // تطبيق الفلترة بناءً على الرقم المختصر
  const filteredData = data.filter((order: OrderType) => {
    const shortId = order.id.replace(/\D/g, "").slice(-4); // استخراج الرقم المختصر
    return shortId.includes(searchTerm); // التحقق من مطابقة الرقم المختصر لقيمة البحث
  });

  // حساب الطلبات التي سيتم عرضها في الصفحة الحالية
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredData.length / ordersPerPage);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-4 lg:px-20 xl:px-40 main-content text-white min-h-screen w-full ">
        <h1 className="glowing-text text-center text-3xl sm:text-4xl font-bold mb-6 sm:mb-12">
          Siparişlerim
        </h1>

        {/* حقل البحث */}
        <div className="mb-1 ml-4 flex justify-start">
          <input
            type="text"
            placeholder="Sipariş numarasına göre ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 md:w-1/3 p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* عرض الطلبات كجدول أو كبطاقات حسب دور المستخدم */}
        {role ? (
          // عرض الجدول إذا كان المستخدم مشرفًا
          <div className="p-4 text-white min-h-full w-full overflow-x-auto lg:overflow-visible shadow-2xl">
            {/* محتوى الجدول */}
            <table className="min-w-full w-[200%] sm:w-full bg-white border border-gray-300 shadow-lg text-base">
              <thead className="bg-orange-400 text-white  ">
                <tr>
                  <th className="px-6 py-3 border-b font-bold text-base md:text-xl text-center ">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 border-b font-bold text-base md:text-xl text-center">
                    تاريخ الطلب
                  </th>
                  <th className="px-6 py-3 border-b  font-bold text-base md:text-xl text-center">
                    معلومات المستلم
                  </th>
                  <th className="px-8 py-3 border-b font-bold text-base md:text-xl text-right ">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order: OrderType, index: number) => (
                  <tr
                    key={order.id}
                    className={`transition-all hover:bg-gray-100 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {/* محتوى الصفوف */}
                    <td className="px-3 py-2 sm:px-6 sm:py-4 text-sm sm:text-base border-b text-center">
                      <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                        # {order.id.replace(/\D/g, "").slice(-4)}
                      </span>
                    </td>

                    <td className="px-3 py-2 sm:px-6 sm:py-4 text-sm sm:text-base border-b text-center">
                      <span className="inline-block px-3 py-1 rounded-lg bg-gray-200 text-gray-700 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          timeZone: "Asia/Istanbul",
                        })}
                      </span>
                    </td>

                    <td className="px-3 py-2 sm:px-6 sm:py-4 text-sm sm:text-base border-b text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-700 font-semibold">
                          {order.recipientInfo}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2 sm:px-6 sm:py-4 border-b text-center">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`mr-3 sm:mr-0 px-2 py-1 text-xs sm:text-base rounded-full font-semibold ${
                            order.status === "teslim edildi"
                              ? "text-white bg-green-500"
                              : "text-white bg-red-500"
                          }`}
                        >
                          {order.status}
                        </span>
                        {/* زر التفاصيل */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="text-orange-600 hover:text-orange-700 focus:outline-none flex flex-col items-center"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <FaEye size={22} />
                              <span className="text-xs mt-1 font-bold">
                                Sipariş ayrıntıları
                              </span>
                            </button>
                          </AlertDialogTrigger>

                          {selectedOrder && selectedOrder.id === order.id && (
                            <AlertDialogContent className="bg-white rounded-lg shadow-2xl p-6 w-full mx-auto max-h-[80vh] overflow-y-auto">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-semibold text-orange-400 mb-2">
                                  Sipariş Detayları
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 space-y-4 ">
                                  <p>
                                    <span className="text-orange-600 font-semibold pr-4">
                                      Sipariş Numarası:
                                    </span>{" "}
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                                      #{" "}
                                      {selectedOrder.id
                                        .replace(/\D/g, "")
                                        .slice(-4)}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="text-orange-600 font-semibold pr-4">
                                      Sipariş Tarihi:
                                    </span>{" "}
                                    {new Date(
                                      selectedOrder.createdAt
                                    ).toLocaleDateString("tr-TR", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                      timeZone: "Asia/Istanbul",
                                    })}
                                  </p>
                                  <p>
                                    <span className="text-orange-600 font-semibold pr-4">
                                      Teslim Tarihi:
                                    </span>{" "}
                                    {selectedOrder.deliveryDate
                                      ? new Date(
                                          selectedOrder.deliveryDate
                                        ).toLocaleDateString("tr-TR", {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                          timeZone: "Asia/Istanbul",
                                        })
                                      : "Teslim tarihi yok"}
                                  </p>

                                  <p>
                                    <span className="text-orange-600 font-semibold pr-4">
                                      Sipariş Durumu:
                                    </span>{" "}
                                    <div className="w-2/3 my-4">
                                      <OrderStatus
                                        status={selectedOrder.status}
                                      />
                                    </div>
                                    {role && (
                                      <form
                                        onSubmit={(e) =>
                                          handleUpdate(e, selectedOrder.id)
                                        }
                                        className="mt-4"
                                      >
                                        <select
                                          className="w-36 p-1 bg-gray-200 text-gray-800 border border-gray-500 rounded-md"
                                          defaultValue={
                                            selectedOrder.status || "Alındı"
                                          }
                                        >
                                          <option value="Alındı">Alındı</option>
                                          <option value="hazırlanıyor">
                                            hazırlanıyor
                                          </option>
                                          <option value="Yolda">Yolda</option>
                                          <option value="teslim edildi">
                                            teslim edildi
                                          </option>
                                        </select>
                                        <button className="p-3 text-white bg-orange-500 rounded-full hover:bg-orange-600 ml-2">
                                          Güncelle
                                        </button>
                                      </form>
                                    )}
                                  </p>

                                  <p>
                                    <span className="text-orange-600 font-semibold pr-4">
                                      Alıcı Bilgileri:
                                    </span>{" "}
                                    {selectedOrder.recipientInfo}
                                  </p>
                                  <p>
                                    <span className="text-orange-600 font-semibold pr-4">
                                      Bölge:
                                    </span>{" "}
                                    {selectedOrder.orderItems[0]?.regionName ||
                                      "Bilgi Yok"}{" "}
                                    -{" "}
                                    {selectedOrder.orderItems[0]
                                      ?.neighborhoods || "Bilgi Yok"}
                                  </p>
                                  <p>
                                    <span className="text-orange-600 font-semibold pr-4">
                                      Zaman:
                                    </span>{" "}
                                    {selectedOrder.orderItems[0]?.startTime ||
                                      "Bilgi Yok"}{" "}
                                    -{" "}
                                    {selectedOrder.orderItems[0]?.endTime ||
                                      "Bilgi Yok"}
                                  </p>

                                  {role && (
                                    <>
                                      <p>
                                        <span className="text-orange-600 font-semibold pr-4">
                                          Kullanıcı Bilgileri:
                                        </span>{" "}
                                        {selectedOrder.user.name}
                                      </p>
                                      <p>
                                        <span className="text-orange-600 font-semibold pr-4">
                                          E-posta:
                                        </span>{" "}
                                        {selectedOrder.user.email}
                                      </p>
                                      <p>
                                        <span className="text-orange-600 font-semibold pr-4">
                                          Telefon:
                                        </span>{" "}
                                        {selectedOrder.user.phoneNumber}
                                      </p>
                                      <p>
                                        <span className="text-orange-600 font-semibold pr-4">
                                          Adres:
                                        </span>{" "}
                                        {selectedOrder.orderItems[0]?.address ||
                                          "Bilgi Yok"}
                                      </p>
                                    </>
                                  )}
                                  <div className="mt-4">
                                    <h3 className="text-2xl font-semibold text-orange-400 mb-2">
                                      Ürünler
                                    </h3>
                                    {selectedOrder.orderItems.map((product) => (
                                      <div
                                        key={product.productId}
                                        className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm"
                                      >
                                        <div className=" flex items-center justify-between">
                                          <div className="flex items-center mb-2">
                                            <span className="text-orange-600 border border-orange-600 rounded-lg px-2  items-center text-xl font-mono">
                                              {product.title}
                                            </span>
                                          </div>
                                          <div className="flex items-center text-gray-600 mb-2">
                                            <span className="font-semibold text-lg text-orange-600 mr-2">
                                              Adet :
                                            </span>
                                            <span className="font-semibold text-xl text-orange-600">
                                              {product.quantity}
                                            </span>
                                          </div>
                                        </div>
                                        {product.desc && (
                                          <div className="text-gray-700">
                                            <span className="font-semibold text-orange-600 mr-2">
                                              Açıklama :
                                            </span>
                                            <span>{product.desc}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  <div className="text-green-600 text-2xl font-semibold mt-4">
                                    <span className="text-orange-400 font-semibold">
                                      Toplam :
                                    </span>{" "}
                                    {selectedOrder.price} TL
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogCancel asChild>
                                <button className="mt-6 px-4 py-2 bg-orange-500 hover:bg-gray-300 text-white text-lg font-bold rounded-md">
                                  Kapat
                                </button>
                              </AlertDialogCancel>
                            </AlertDialogContent>
                          )}
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // عرض البطاقات إذا كان المستخدم عميلًا
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 rounded-lg">
            {currentOrders.map((order: OrderType) => (
              <div
                key={order.id}
                className="bg-orange-50 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-bold mb-4 text-orange-600">
                  <span className="text-gray-700">Sipariş numarası :</span> #{" "}
                  {order.id.replace(/\D/g, "").slice(-4)}
                </h3>
                <p className="mb-2 text-gray-600">
                  <strong className="text-orange-600">Sipariş tarihi :</strong>{" "}
                  <span className="text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      timeZone: "Asia/Istanbul",
                    })}
                  </span>
                </p>
                <p className="mb-2 text-gray-600">
                  <strong className="text-orange-600">Alıcı bilgileri :</strong>{" "}
                  <span className="text-gray-800">{order.recipientInfo}</span>
                </p>
                <p className="mb-2 text-gray-600">
                  <strong className="text-orange-600">Durumu :</strong>
                  <span
                    className={`px-2 py-1 ml-2 rounded-full font-semibold ${
                      order.status === "teslim edildi"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="mt-4 text-orange-600 hover:text-orange-700 focus:outline-none flex items-center"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FaEye size={22} className="inline" />
                      <span className="ml-2 font-semibold">
                        Sipariş Detayları
                      </span>
                    </button>
                  </AlertDialogTrigger>

                  {selectedOrder && selectedOrder.id === order.id && (
                    <AlertDialogContent className="bg-white rounded-lg shadow-2xl p-6 w-full mx-auto max-h-[80vh] overflow-y-auto">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-semibold text-orange-400 mb-2">
                          Sipariş Detayları
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 space-y-4 ">
                          <p>
                            <span className="text-orange-600 font-semibold pr-4">
                              Sipariş Numarası:
                            </span>{" "}
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                              # {selectedOrder.id.replace(/\D/g, "").slice(-4)}
                            </span>
                          </p>
                          <p>
                            <span className="text-orange-600 font-semibold pr-4">
                              Sipariş Tarihi:
                            </span>{" "}
                            {new Date(
                              selectedOrder.createdAt
                            ).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              timeZone: "Asia/Istanbul",
                            })}
                          </p>
                          <p>
                            <span className="text-orange-600 font-semibold pr-4">
                              Teslim Tarihi:
                            </span>{" "}
                            {selectedOrder.deliveryDate
                              ? new Date(
                                  selectedOrder.deliveryDate
                                ).toLocaleDateString("tr-TR", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                  timeZone: "Asia/Istanbul",
                                })
                              : "Teslim tarihi yok"}
                          </p>

                          <p>
                            <span className="text-orange-600 font-semibold pr-4">
                              Sipariş Durumu:
                            </span>{" "}
                            <div className="w-2/3 my-4">
                              <OrderStatus status={selectedOrder.status} />
                            </div>
                            {role && (
                              <form
                                onSubmit={(e) =>
                                  handleUpdate(e, selectedOrder.id)
                                }
                                className="mt-4"
                              >
                                <select
                                  className="w-36 p-1 bg-gray-200 text-gray-800 border border-gray-500 rounded-md"
                                  defaultValue={
                                    selectedOrder.status || "Alındı"
                                  }
                                >
                                  <option value="Alındı">Alındı</option>
                                  <option value="hazırlanıyor">
                                    hazırlanıyor
                                  </option>
                                  <option value="Yolda">Yolda</option>
                                  <option value="teslim edildi">
                                    teslim edildi
                                  </option>
                                </select>
                                <button className="p-3 text-white bg-orange-500 rounded-full hover:bg-orange-600 ml-2">
                                  Güncelle
                                </button>
                              </form>
                            )}
                          </p>

                          <p>
                            <span className="text-orange-600 font-semibold pr-4">
                              Alıcı Bilgileri:
                            </span>{" "}
                            {selectedOrder.recipientInfo}
                          </p>
                          <p>
                            <span className="text-orange-600 font-semibold pr-4">
                              Bölge:
                            </span>{" "}
                            {selectedOrder.orderItems[0]?.regionName ||
                              "Bilgi Yok"}{" "}
                            -{" "}
                            {selectedOrder.orderItems[0]?.neighborhoods ||
                              "Bilgi Yok"}
                          </p>
                          <p>
                            <span className="text-orange-600 font-semibold pr-4">
                              Zaman:
                            </span>{" "}
                            {selectedOrder.orderItems[0]?.startTime ||
                              "Bilgi Yok"}{" "}
                            -{" "}
                            {selectedOrder.orderItems[0]?.endTime ||
                              "Bilgi Yok"}
                          </p>

                          {role && (
                            <>
                              <p>
                                <span className="text-orange-600 font-semibold pr-4">
                                  Kullanıcı Bilgileri:
                                </span>{" "}
                                {selectedOrder.user.name}
                              </p>
                              <p>
                                <span className="text-orange-600 font-semibold pr-4">
                                  E-posta:
                                </span>{" "}
                                {selectedOrder.user.email}
                              </p>
                              <p>
                                <span className="text-orange-600 font-semibold pr-4">
                                  Telefon:
                                </span>{" "}
                                {selectedOrder.user.phoneNumber}
                              </p>
                              <p>
                                <span className="text-orange-600 font-semibold pr-4">
                                  Adres:
                                </span>{" "}
                                {selectedOrder.orderItems[0]?.address ||
                                  "Bilgi Yok"}
                              </p>
                            </>
                          )}
                          <div className="mt-4">
                            <h3 className="text-2xl font-semibold text-orange-400 mb-2">
                              Ürünler
                            </h3>
                            {selectedOrder.orderItems.map((product) => (
                              <div
                                key={product.productId}
                                className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm"
                              >
                                <div className=" flex items-center justify-between">
                                  <div className="flex items-center mb-2">
                                    <span className="text-orange-600 border border-orange-600 rounded-lg px-2  items-center text-xl font-mono">
                                      {product.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mb-2">
                                    <span className="font-semibold text-lg text-orange-600 mr-2">
                                      Adet :
                                    </span>
                                    <span className="font-semibold text-xl text-orange-600">
                                      {product.quantity}
                                    </span>
                                  </div>
                                </div>
                                {product.desc && (
                                  <div className="text-gray-700">
                                    <span className="font-semibold text-orange-600 mr-2">
                                      Açıklama :
                                    </span>
                                    <span>{product.desc}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="text-green-600 text-2xl font-semibold mt-4">
                            <span className="text-orange-400 font-semibold">
                              Toplam :
                            </span>{" "}
                            {selectedOrder.price} TL
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogCancel asChild>
                        <button className="mt-6 px-4 py-2 bg-orange-500 hover:bg-gray-300 text-white text-lg font-bold rounded-md">
                          Kapat
                        </button>
                      </AlertDialogCancel>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </div>
            ))}
          </div>
        )}

        {/* أزرار التنقل بين الصفحات */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            önceki
          </button>
          <span className="text-gray-700">
            Sayfa {currentPage} - {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            sonraki
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
