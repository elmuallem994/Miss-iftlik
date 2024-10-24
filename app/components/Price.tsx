"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductType } from "../types/types";
import { useCartStore } from "@/utils/store";

const Price = ({ product }: { product: ProductType }) => {
  const [total, setTotal] = useState(product.price); // سعر المنتج
  const [quantity, setQuantity] = useState(1); // عدد المنتجات

  const { addToCart } = useCartStore(); // استخدام الحالة لإدارة السلة

  useEffect(() => {
    useCartStore.persist.rehydrate(); // استرجاع البيانات من التخزين المحلي عند التحميل
  }, []);

  useEffect(() => {
    setTotal(quantity * product.price); // تحديث السعر بناءً على الكمية
  }, [quantity, product.price]);

  const handleCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      img: product.img,
      price: total,
      quantity: quantity,
    });
    toast.success("The product added to the cart!"); // إظهار رسالة تأكيد
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${total}</h2>{" "}
      {/* عرض السعر الإجمالي */}
      {/* حاوية العدد وزر الإضافة للسلة */}
      <div className="flex justify-between items-center">
        {/* العدد */}
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))} // تقليل العدد
            >
              {"<"}
            </button>
            <span>{quantity}</span> {/* عرض العدد */}
            <button
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))} // زيادة العدد
            >
              {">"}
            </button>
          </div>
        </div>
        {/* زر الإضافة للسلة */}
        <button
          className="uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500"
          onClick={handleCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
