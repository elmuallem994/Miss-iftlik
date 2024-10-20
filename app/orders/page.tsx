"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderType } from "../types/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  // التحقق مما إذا كان المستخدم غير مسجل دخوله
  if (!isSignedIn) {
    router.push("/sign-in");
  }

  // التحقق مما إذا كان المستخدم مشرفًا
  const isAdmin = user?.publicMetadata?.role === "admin";

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

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th>Delivery Date</th> {/* عمود لعرض اليوم والتاريخ */}
            {isAdmin && <th>User Info</th>} {/* يظهر فقط للمشرف */}
            {isAdmin && <th>Address</th>} {/* عرض العنوان للمشرف فقط */}
            {isAdmin && <th>Region</th>} {/* عرض اسم المنطقة للمشرف فقط */}
            <th className="hidden md:block">Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderType) => (
            <tr
              className={`${item.status !== "delivered" && "bg-red-50"}`}
              key={item.id}
            >
              <td className="hidden md:block py-6 px-1">
                {item.id.replace(/\D/g, "").slice(-4)}{" "}
                {/* إزالة الحروف وعرض آخر 4 أرقام فقط */}
              </td>

              <td className="py-6 px-1">
                {item.createdAt.toString().slice(0, 10)}
              </td>
              <td className="py-6 px-1">{item.price}</td>
              <td className="py-6 px-1">{item.deliveryDate}</td>

              {/* عرض User Info و Address و Region للمشرف فقط */}
              {isAdmin && (
                <>
                  <td className="py-6 px-1">
                    <p>{item.user.name}</p>
                    <p>{item.user.email}</p>
                    <p>{item.user.phoneNumber}</p>
                  </td>
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
                {item.products[0].title}
              </td>
              <td className="py-6 px-1">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
