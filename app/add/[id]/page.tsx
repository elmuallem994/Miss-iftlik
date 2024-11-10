// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import AddPage from "../page";
import { useLoadingStore } from "@/utils/store";

const EditProductPage = ({ params }: { params: { id: string } }) => {
  const [productData, setProductData] = useState<unknown>(null);

  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/products/${params.id}`
        );
        if (!res.ok) {
          throw new Error("فشل جلب بيانات المنتج!");
        }
        const data = await res.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id, setLoading]);

  // التأكد من أن productData يحتوي على جميع القيم المطلوبة قبل تمريره
  if (
    !productData ||
    !productData.title ||
    !productData.desc ||
    !productData.price ||
    !productData.catSlug ||
    !productData.img
  ) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <AddPage productData={productData} /> {/* Passing the product data */}
    </div>
  );
};

export default EditProductPage;
