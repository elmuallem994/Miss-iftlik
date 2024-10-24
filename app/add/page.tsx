"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};

const AddPage = () => {
  const { isSignedIn, user } = useUser();
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // حالة لمعاينة الصورة

  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in"); // توجيه المستخدم لتسجيل الدخول إذا لم يكن مسجلاً دخوله
    } else if (user?.publicMetadata.role !== "admin") {
      router.push("/"); // توجيه المستخدم إلى الصفحة الرئيسية إذا لم يكن مشرفًا
    }
  }, [isSignedIn, user, router]);

  if (!isSignedIn) {
    return <p>Loading...</p>; // عرض رسالة التحميل أثناء التحقق من حالة الجلسة
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const selectedFile = (target.files as FileList)[0];
    setFile(selectedFile);

    // إنشاء معاينة للصورة المختارة
    const filePreview = URL.createObjectURL(selectedFile);
    setPreview(filePreview);
  };

  const upload = async () => {
    const data = new FormData();
    data.append("file", file!);
    data.append("upload_preset", "missciftlik");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmdupmxws/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const resData = await res.json();
    return resData.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = await upload();
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({
          img: url,
          ...inputs,
        }),
      });

      const data = await res.json();

      router.push(`/product/${data.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center text-red-500">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">
          Add New Product
        </h1>
        <div className="w-full flex flex-col gap-2 ">
          <label
            className="text-sm cursor-pointer flex gap-4 items-center"
            htmlFor="file"
          >
            <Image src="/upload.png" alt="" width={30} height={20} />
            <span>Upload Image</span>
          </label>
          <input
            type="file"
            onChange={handleChangeImg}
            id="file"
            className="hidden"
          />

          {/* عرض معاينة الصورة إذا كانت موجودة */}
          {preview && (
            <div className="mt-4  ">
              <Image
                src={preview}
                alt="Uploaded Preview"
                width={70} // حجم عرض الصورة المعاينة
                height={70} // حجم ارتفاع الصورة المعاينة
                className="object-cover aspect-square rounded-md"
              />
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Title</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Description</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Price</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Category</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="pizzas"
            name="catSlug"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPage;
