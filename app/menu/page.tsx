"use client";

import Link from "next/link";
import { MenuType } from "../types/types";
import { useUser } from "@clerk/nextjs";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLoadingStore } from "@/utils/store";

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
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center ">
      {menu.map((category) => (
        <div
          key={category.id}
          className="relative w-full h-1/3 bg-cover p-8 md:h-1/2"
          style={{ backgroundImage: `url(${category.img})` }}
        >
          <Link
            href={`/menu/${category.slug}`}
            className="absolute inset-0 z-10"
          />
          <div className="relative flex flex-col justify-between text-orange-50 w-[75%] md:w-[80%] xl:w-[60%] 2xl:w-[55%] p-3 md:p-6 bg-orange-600 bg-opacity-40 rounded-md h-full">
            <h1 className="uppercase font-bold text-lg lg:text-3xl">
              {category.title}
            </h1>
            <p className="text-sm my-4 flex-grow">{category.desc}</p>
            <button className="self-start bg-orange-600 text-white py-1 px-2 md:py-2 md:px-4 rounded-md">
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
  );
};

export default MenuPage;
