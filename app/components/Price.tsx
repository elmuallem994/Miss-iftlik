"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductType } from "../types/types";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Trash2 } from "lucide-react"; // أيقونة سلة المهملات
import { useCartStore } from "@/utils/store";

const Price = ({ product }: { product: ProductType }) => {
  const [quantity, setQuantity] = useState(1); // عدد المنتجات
  const [isEditing, setIsEditing] = useState(false); // حالة لتحديد ما إذا كانت الكمية قابلة للتحرير

  const { products, addToCart, updateCartQuantity, removeFromCart } =
    useCartStore();

  // التحقق مما إذا كان المنتج موجودًا في السلة عند التحميل
  useEffect(() => {
    const existingProduct = products.find((p) => p.id === product.id);
    if (existingProduct) {
      setQuantity(existingProduct.quantity);
      setIsEditing(true); // إظهار التحكم في الكمية إذا كان المنتج موجودًا
    }
  }, [products, product.id]);

  const handleDecrease = () => {
    if (quantity === 1) {
      // إذا كانت الكمية 1، نقوم بإزالة المنتج
      removeFromCart({
        ...product,
        quantity: quantity,
      });

      setIsEditing(false); // إخفاء التحكم عند الحذف
    } else {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        updateCartQuantity(product.id, newQuantity);
        return newQuantity;
      });
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      updateCartQuantity(product.id, newQuantity);
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      desc: product.desc, // تأكد من إضافة الوصف هنا
      img: product.img,
      price: product.price,
      quantity,
    });
    setIsEditing(true); // إظهار التحكم في الكمية
    toast.success("The product has been added to the cart!"); // إظهار رسالة تأكيد
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* حاوية العدد */}
      {isEditing ? (
        <div className="flex items-center gap-1 ">
          <Button
            variant="destructive"
            className="bg-orange-400 hover:bg-orange-500"
            size="sm"
            onClick={handleDecrease}
          >
            <span className="text-2xl items-center  ">
              {quantity === 1 ? <Trash2 size={16} className="text-lg" /> : "-"}
            </span>
          </Button>
          <Input
            value={quantity}
            readOnly
            className="w-10 text-center text-white text-lg bg-orange-400"
            aria-label="Current quantity"
          />
          <Button
            variant="destructive"
            className="bg-orange-400 hover:bg-orange-500"
            size="sm"
            onClick={handleIncrease}
          >
            <span className="text-2xl items-center pb-1 ">+</span>
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          className="bg-orange-50 text-black hover:bg-orange-200"
          onClick={handleAddToCart}
        >
          Sepete Ekle
        </Button>
      )}
    </div>
  );
};

export default Price;
