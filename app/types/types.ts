export type MenuType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

export type ProductType = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  options?: { title: string; additionalPrice: number }[];
};

export type OrderType = {
  id: string;
  userId: string;
  price: number;
  products: CartItemType[];
  status: string;
  regionId?: number; // معرف المنطقة المرتبطة بالتوصيل
  deliveryDate?: Date; // تاريخ التوصيل
  createdAt: Date; // تاريخ إنشاء الطلب
  updatedAt: Date; // تاريخ آخر تحديث للطلب
};

export type CartItemType = {
  id: string;
  title: string;
  img?: string;
  price: number;
  optionTitle?: string;
  quantity: number;
};

export type CartType = {
  products: CartItemType[];
  totalItems: number;
  totalPrice: number;
};

export type ActionTypes = {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (item: CartItemType) => void;
  clearCart: () => void;
};

// إضافة نوع البيانات RegionType
export type RegionType = {
  id: number;
  name: string;
  deliveryDays: string[]; // تخزين الأيام كمصفوفة JSON
};
