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
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" onClick={handleDecrease}>
            {quantity === 1 ? <Trash2 size={16} /> : "-"}
          </Button>
          <Input
            value={quantity}
            readOnly
            className="w-12 text-center"
            aria-label="Current quantity"
          />
          <Button variant="destructive" size="sm" onClick={handleIncrease}>
            +
          </Button>
        </div>
      ) : (
        <Button variant="default" onClick={handleAddToCart}>
          أضف للسلة
        </Button>
      )}
    </div>
  );
};

export default Price;
