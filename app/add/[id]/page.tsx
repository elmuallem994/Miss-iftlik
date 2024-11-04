"use client";

import { useEffect, useState } from "react";
import AddPage from "../page";

const EditProductPage = ({ params }: { params: { id: string } }) => {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/products/${params.id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch product data!");
        }
        const data = await res.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [params.id]);

  if (!productData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
    
      <AddPage productData={productData} /> {/* Passing the product data */}
    </div>
  );
};

export default EditProductPage;
