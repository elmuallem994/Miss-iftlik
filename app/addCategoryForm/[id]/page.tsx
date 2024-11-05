"use client";
// app/addCategoryForm/[id]/page.tsx
import { useEffect, useState } from "react";

import AddCategoryForm from "../page";

const EditCategoryPage = ({ params }: { params: { id: string } }) => {
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/categories/${params.id}`
        );
        if (!res.ok) {
          throw new Error("فشل جلب بيانات الفئة!");
        }
        const data = await res.json();
        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, [params.id]);

  if (!categoryData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">تعديل الصنف</h2>
      <AddCategoryForm categoryData={categoryData} />{" "}
      {/* Passing the category data */}
    </div>
  );
};

export default EditCategoryPage;
