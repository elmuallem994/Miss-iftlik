"use client";

import Link from "next/link";
import { MenuType } from "../types/types";
import { useUser } from "@clerk/nextjs";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLoadingStore } from "@/utils/store";
import Image from "next/image";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuType>([]);
  const { user } = useUser();
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true); // تفعيل مؤشر التحميل عند بدء جلب البيانات
      try {
        const data = await getData();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // إيقاف مؤشر التحميل عند الانتهاء
      }
    };

    fetchMenu();
  }, [setLoading]);

  const handleDelete = async (id: string) => {
    setLoading(true); // تفعيل مؤشر التحميل عند بدء عملية الحذف
    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMenu((prev) => prev.filter((category) => category.id !== id));
      } else {
        console.error("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // إيقاف مؤشر التحميل عند الانتهاء
    }
  };

  const isAdmin = user?.publicMetadata.role === "admin";

  return (
    <div className="min-h-screen w-full text-orange-500 pt-40">
      <h1 className="glowing-text text-center text-6xl text-white font-extralight mb-12">
        Çeşitler
      </h1>
      <div className="w-full flex justify-center items-center py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-[60%] lg:w-[55%]">
          {menu.map((category) => (
            <div
              key={category.id}
              className="w-full h-full flex flex-col items-center justify-between p-4 border-2 border-orange-500 rounded-lg shadow-lg  relative"
            >
              <Link
                href={`/menu/${category.slug}`}
                className="absolute inset-0 z-10 rounded-lg overflow-hidden"
              />
              <div className="relative w-full h-48 md:h-64 lg:h-72">
                <Image
                  src={category.img}
                  alt={category.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col items-center justify-center text-center mt-4 px-2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-orange-500">
                  {category.title}
                </h2>
                <p className="my-2 md:my-4 text-sm md:text-lg text-gray-300">
                  {category.desc}
                </p>
                <button className="bg-orange-500 text-white py-1 px-3 md:py-2 md:px-4 rounded-md hover:bg-orange-600 transition-all">
                  Keşfet
                </button>
              </div>
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/addCategoryForm/${category.id}`}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <FaEdit className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
