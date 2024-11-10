"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ProductType } from "@/app/types/types";
import Image from "next/image";
import Link from "next/link";

import { toast } from "react-toastify";
import { useLoadingStore } from "@/utils/store"; // استيراد useLoadingStore
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/app/components/ui/alert-dialog";

import Price from "@/app/components/Price";

type Props = {
  params: { category: string };
};

const CategoryPage = ({ params }: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const { user } = useUser();

  const setLoading = useLoadingStore((state) => state.setLoading); // تفعيل setLoading من store

  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // تفعيل مؤشر التحميل عند بدء جلب البيانات
      try {
        const res = await fetch(
          `http://localhost:3000/api/products?cat=${params.category}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data: ProductType[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // إيقاف مؤشر التحميل عند الانتهاء
      }
    };

    fetchProducts();
  }, [params.category, setLoading]);

  const handleDelete = async () => {
    if (!productIdToDelete) return;

    setLoading(true); // تفعيل مؤشر التحميل عند بدء عملية الحذف

    try {
      const res = await fetch(
        `http://localhost:3000/api/products/${productIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("تم حذف المنتج بنجاح!");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productIdToDelete)
        );
        setProductIdToDelete(null);
      } else {
        throw new Error("فشل في حذف المنتج.");
      }
    } catch (error) {
      console.error("خطأ أثناء حذف المنتج:", error);
      toast.error("حدث خطأ أثناء حذف المنتج.");
    } finally {
      setLoading(false); // إيقاف مؤشر التحميل عند الانتهاء
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="my-20 mt-52 flex items-center justify-center py-8 md:py-12 ">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-lg mx-auto px-4 md:px-0">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-between p-4 border-2 border-orange-500 rounded-lg shadow-lg bg-transparent w-full h-full"
            >
              <div className="relative w-full h-40 sm:h-48 lg:h-60">
                {item.img && (
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                )}
              </div>

              <div className="flex flex-col items-center justify-between pt-4 w-full">
                <h2 className="text-lg lg:text-xl font-semibold uppercase text-orange-500 text-center">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-300 text-center my-3 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {user?.publicMetadata?.role === "admin" ? (
                <div className="flex justify-between w-full mt-4">
                  <Link href={`/add/${item.id}`}>
                    <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      ✏️ تعديل
                    </button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => setProductIdToDelete(item.id)}
                      >
                        🗑️ حذف
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          هل أنت متأكد من الحذف؟
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          لا يمكن التراجع عن هذا الإجراء بعد الحذف.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-between w-full mt-2 px-2">
                  {/* عرض السعر في شاشات الجوال */}
                  <h2 className="text-lg font-bold text-white block sm:hidden pb-3 sm:pb-0">
                    {item.price} TL
                  </h2>
                  <div className="block sm:hidden w-full">
                    <Price product={item} />
                  </div>

                  {/* عرض السعر والزر في نفس الصف للشاشات الأكبر */}
                  <div className="items-center justify-between w-full hidden sm:flex">
                    <h2 className="text-lg font-bold text-white">
                      {item.price} TL
                    </h2>
                    <Price product={item} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
