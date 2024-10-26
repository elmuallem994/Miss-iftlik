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
import { Separator } from "@/app/components/ui/separator";

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {products.map((item) => (
          <Card key={item.id} className="pb-3 ">
            <CardHeader className="relative w-80 h-48 ">
              {item.img && (
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-fill "
                />
              )}
            </CardHeader>

            <CardContent className="flex justify-between items-center pt-3">
              <CardTitle className="text-lg lg:text-2xl uppercase">
                {item.title}
              </CardTitle>
              <h2 className="text-lg lg:text-xl">{item.price} TL</h2>
            </CardContent>
            <Separator />

            {user?.publicMetadata?.role === "admin" ? (
              <CardFooter className="flex justify-between">
                <Link href={`/add/${item.id}`}>
                  <button className="p-2 bg-blue-500 text-white rounded-md">
                    ✏️ تعديل
                  </button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md"
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
              <CardFooter className="flex justify-center items-center py-4">
                <Price product={item} />
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
