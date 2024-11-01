export type MenuType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img: string;
  color: string;
}[];

export type UserType = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
};

// إضافة نوع البيانات RegionType
export type RegionType = {
  id: number;
  name: string;
  deliveryDays: string[]; // تخزين الأيام كمصفوفة JSON
};

export type OrderType = {
  id: string;
  userId: string;
  price: number;
  status: string;
  regionId?: number; // معرف المنطقة المرتبطة بالتوصيل
  deliveryDate?: string;
  recipientInfo?: string; // حقل واحد يجمع اسم ورقم المستلم تحت بعض كما طلبت
  region: RegionType;
  user: UserType; // تضمين معلومات المستخدم هنا
  address: AddressType; // تضمين معلومات العنوان هنا
  orderItems: OrderItemType[]; // إضافة الحقل الجديد للمنتجات
  createdAt: Date; // تاريخ إنشاء الطلب
  updatedAt: Date; // تاريخ آخر تحديث للطلب
};

export type OrderItemType = {
  orderId: string; // معرف الطلب
  productId: string; // معرف المنتج
  title: string; // اسم المنتج
  desc?: string; // وصف المنتج
  img: string; // صورة المنتج
  quantity: number; // الكمية المطلوبة
  price: number; // سعر المنتج للطلب
};

export type ProductType = {
  id: string;
  title: string;
  desc?: string;
  img: string;
  price: number;
  quantity: number;
};

export type CartItemType = {
  id: string;
  title: string;
  desc?: string;
  img: string;
  price: number;
  optionTitle?: string;
  quantity: number;
};

export type CartType = {
  products: ProductType[];
  totalItems: number;
  totalPrice: number;
};

export type ActionTypes = {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (item: CartItemType) => void;
  clearCart: () => void;
  updateCartQuantity: (productId: string, newQuantity: number) => void; // أضف هذا السطر
};

export type AddressType = {
  id: number;
  il: string;
  ilce: string;
  mahalle: string;
  adres: string;
  region?: {
    // إضافة الخاصية region
    id: number;
    name: string;
  };
};
