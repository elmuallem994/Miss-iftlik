// components/AddCategoryForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "react-hot-toast";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/components/ui/form";
import { Separator } from "@/app/components/ui/separator";
import { useRouter } from "next/navigation";

// Schema للتحقق من صحة البيانات
const categorySchema = z.object({
  title: z
    .string()
    .min(3, { message: "العنوان مطلوب (يجب أن يكون 3 أحرف على الأقل)" }),
  desc: z
    .string()
    .min(5, { message: "الوصف مطلوب (يجب أن يكون 5 أحرف على الأقل)" }),
  color: z.string().min(3, { message: "اللون مطلوب" }),
  slug: z.string().min(3, { message: "الـ Slug مطلوب" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddCategoryForm = ({ categoryData }: { categoryData?: any }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  // إعداد React-Hook-Form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: categoryData?.title || "",
      desc: categoryData?.desc || "",
      color: categoryData?.color || "",
      slug: categoryData?.slug || "",
    },
  });

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const selectedFile = (target.files as FileList)[0];
    setFile(selectedFile);
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

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      let imgUrl = categoryData?.img || "";

      if (file) {
        imgUrl = await upload();
      }

      const method = categoryData ? "PUT" : "POST";
      const url = categoryData
        ? `http://localhost:3000/api/categories/${categoryData.id}`
        : "http://localhost:3000/api/categories";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, img: imgUrl }),
      });

      if (res.ok) {
        toast.success(
          categoryData ? "تم تعديل الصنف بنجاح!" : "تم إضافة الصنف بنجاح!"
        );
        router.push("/menu");
      } else {
        toast.error("حدث خطأ أثناء العملية.");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ في الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {categoryData ? "تعديل الصنف" : "إضافة صنف جديد"}
      </h2>
      <Separator className="mb-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* حقل رفع الصورة */}
          <div className="w-full flex flex-col gap-2">
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
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Uploaded Preview"
                  width={70}
                  height={70}
                  className="object-cover aspect-square rounded-md"
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Input
                    placeholder="أدخل العنوان"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Input
                    placeholder="أدخل الوصف"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اللون</FormLabel>
                <FormControl>
                  <Input
                    placeholder="أدخل اللون"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="أدخل الـ Slug"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {categoryData ? "حفظ التعديلات" : "إضافة الصنف"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCategoryForm;
