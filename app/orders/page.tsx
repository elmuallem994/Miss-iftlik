"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderType } from "../types/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import LoadingSpinner from "@/app/components/ui/loadingSpinner";
import { useEffect } from "react";

const OrdersPage = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  // التحقق مما إذا كان المستخدم غير مسجل دخوله
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

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
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const status = input.value;

    mutation.mutate({ id, status });
    toast.success("The order status has been changed!");
  };

  if (isPending) return <LoadingSpinner />; // عرض مكون التحميل إذا كان جاري التحميل

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th> انشاء الطلب </th>
            {role && <th>معلومات تسجيل الدخول</th>} {/* يظهر فقط للمشرف */}
            <th>تاريخ التسليم</th> {/* عمود لعرض اليوم والتاريخ */}
            <th>معلومات المستلم</th>
            {role && <th>العنوان</th>} {/* عرض العنوان للمشرف فقط */}
            {role && <th>المنطقة</th>} {/* عرض اسم المنطقة للمشرف فقط */}
            <th className="hidden md:block">المنتجات</th>
            <th>السعر</th>
            <th>حالة الطلب</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderType) => (
            <tr
              className={`bg-red-50 blink-green`} // إضافة الوميض لجميع الحالات
              key={item.id}
            >
              <td className="hidden md:block py-6 px-1">
                #{item.id.replace(/\D/g, "").slice(-4)}{" "}
                {/* إزالة الحروف وعرض آخر 4 أرقام فقط */}
              </td>

              <td className="py-6 px-1">
                {item.createdAt.toString().slice(0, 10)}
              </td>

              {role && (
                <td className="py-6 px-1">
                  <p>{item.user.name}</p>
                  <p>{item.user.email}</p>
                  <p>{item.user.phoneNumber}</p>
                </td>
              )}

              <td className="py-6 px-1">{item.deliveryDate}</td>

              <td className="py-6 px-1">
                <p>{item.recipientInfo}</p>{" "}
                {/* Displaying recipient information */}
              </td>

              {/* عرض User Info و Address و Region للمشرف فقط */}
              {role && (
                <>
                  <td className="py-6 px-1">
                    {item.address && (
                      <>
                        {item.address.il && item.address.ilce && (
                          <p>{`${item.address.il} / ${item.address.ilce}`}</p>
                        )}
                        {item.address.mahalle && <p>{item.address.mahalle}</p>}
                        {item.address.adres && <p>{item.address.adres}</p>}
                      </>
                    )}
                  </td>

                  <td className="py-6 px-1">
                    {item.address?.region?.name || "Region data not available"}
                  </td>
                </>
              )}

              <td className="hidden md:block py-6 px-1">
                {item.orderItems.map((product) => (
                  <div
                    key={product.productId}
                  >{`${product.title} x ${product.quantity}`}</div>
                ))}
              </td>
              <td className="py-6 px-1">{item.price}</td>

              {role ? (
                <td>
                  <form
                    className="flex items-center justify-center gap-4"
                    onSubmit={(e) => handleUpdate(e, item.id)}
                  >
                    <input
                      placeholder={item.status}
                      className="p-2 ring-1 ring-red-100 rounded-md"
                    />
                    <button className="bg-orange-400 p-2 rounded-full">
                      <Image src="/edit.png" alt="" width={20} height={20} />
                    </button>
                  </form>
                </td>
              ) : (
                <td className="py-6 px-1">{item.status}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
