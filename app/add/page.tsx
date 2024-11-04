"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormMessage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useLoadingStore } from "@/utils/store";

type AddPageProps = {
  productData?: {
    id: string;
    title: string;
    desc: string;
    price: number;
    catSlug: string;
    img: string; // Add the 'img' field here
  };
};

const productSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  desc: z.string().min(5, { message: "Description is required" }),
  price: z.preprocess(
    (value) => parseFloat(z.string().parse(value)),
    z.number().positive({ message: "Price must be a positive number" })
  ),
  catSlug: z.string().min(3, { message: "Category is required" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AddPage = ({ productData }: AddPageProps) => {
  const { isSignedIn, user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    productData?.img || null
  );

  const [categories, setCategories] = useState<
    { id: string; title: string; slug: string }[]
  >([]);
  const { setLoading } = useLoadingStore();

  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: productData?.title || "",
      desc: productData?.desc || "",
      price: productData?.price || 0,
      catSlug: productData?.catSlug || "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, [isSignedIn, user, router]);

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = (e.target.files as FileList)[0];
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

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true); // Start loading
      // If there's no image file and it's a new product, show an error message
      if (!file && !productData?.img) {
        toast.error("Please upload an image for the product.");
        return; // Stop execution if there's no image
      }

      let imgUrl = productData?.img || ""; // Use existing image URL if no new image is uploaded

      if (file) {
        imgUrl = await upload();
      }

      const requestOptions = {
        method: productData ? "PUT" : "POST",
        body: JSON.stringify({ ...data, img: imgUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const url = productData
        ? `http://localhost:3000/api/products/${productData.id}`
        : "http://localhost:3000/api/products";

      const res = await fetch(url, requestOptions);

      if (res.ok) {
        toast.success(
          productData
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        router.push("/menu");
      } else {
        toast.error("Failed to save product.");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while saving the product.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="main-content p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      <div className="bg-white p-8  rounded-lg shadow-lg  w-full max-w-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 w-full"
          >
            <h1 className="text-3xl pb-7 text-orange-300 font-bold">
              {productData ? "تعديل المنتج" : "أضف منتج جديد"}
            </h1>
            <FormItem>
              <FormLabel
                htmlFor="file"
                className="cursor-pointer text-red-500 border p-2 "
              >
                Upload Image
              </FormLabel>
              <input
                type="file"
                onChange={handleChangeImg}
                id="file"
                className="hidden"
              />
              {preview ? (
                <div className="mt-4">
                  <Image
                    src={preview}
                    alt="Uploaded Preview"
                    width={70}
                    height={70}
                    className="object-cover aspect-square rounded-md"
                  />
                  <p className="mt-2 text-green-500">
                    Image uploaded successfully!
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-gray-500">No image uploaded yet.</p>
              )}
            </FormItem>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Title" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product Price"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="catSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {productData ? "Save Changes" : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddPage;
