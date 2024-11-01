"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ProductType } from "@/app/types/types";
import Image from "next/image";
import Link from "next/link";

import { toast } from "react-toastify";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  params: { category: string };
};

const CategoryPage = ({ params }: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const { user } = useUser();

  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchProducts = async () => {
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
      }
    };

    fetchProducts();
  }, [params.category]);

  const handleDelete = async () => {
    if (!productIdToDelete) return;

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-[70%] lg:w-[60%]">
        {products.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col items-center justify-between p-2 border-2 border-orange-500 rounded-lg shadow-lg bg-transparent"
          >
            <CardHeader className="relative w-full h-48">
              {item.img && (
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover rounded-md"
                />
              )}
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-between pt-5 w-full">
              <CardTitle className="text-xl lg:text-3xl uppercase text-orange-500">
                {item.title}
              </CardTitle>
              <p className="text-sm lg:text-lg text-gray-700 text-center mt-2">
                {item.desc}
              </p>
            </CardContent>

            {user?.publicMetadata?.role === "admin" ? (
              <CardFooter className="flex justify-between w-full mt-4">
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
              </CardFooter>
            ) : (
              <CardFooter className="w-full">
                <div className="flex justify-between items-center py-4 px-3 w-full">
                  <h2
                    className="text-lg lg:text-3xl text-white"
                    style={{ width: "100px" }}
                  >
                    {item.price} TL
                  </h2>
                  <Price product={item} />
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
