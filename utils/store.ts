import { ActionTypes, CartType } from "@/app/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItemType = {
  id: string;
  title: string;
  desc: string;
  img: string;
  price: number;
  optionTitle?: string;
  quantity: number;
};

const INITIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  persist<CartType & ActionTypes>(
    (set, get) => ({
      products: INITIAL_STATE.products,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,

      addToCart(item: CartItemType) {
        console.log("Adding item to cart:", item); // التأكد من أن `desc` موجود
        const products = get().products;
        const productInState = products.find(
          (product) => product.id === item.id
        );

        if (productInState) {
          const updatedProducts = products.map((product) =>
            product.id === productInState.id
              ? {
                  ...product,
                  quantity: product.quantity + item.quantity,
                  desc: item.desc, // التأكد من تضمين `desc`
                }
              : product
          );
          set((state) => ({
            products: updatedProducts,
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price * item.quantity,
          }));
        } else {
          set((state) => ({
            products: [...state.products, item],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price * item.quantity,
          }));
        }
      },

      updateCartQuantity(productId: string, newQuantity: number) {
        set((state) => {
          const updatedProducts = state.products.map((product) => {
            if (product.id === productId) {
              return {
                ...product,
                quantity: newQuantity,
              };
            }
            return product;
          });

          const newTotalItems = updatedProducts.reduce(
            (sum, product) => sum + product.quantity,
            0
          );
          const newTotalPrice = updatedProducts.reduce(
            (sum, product) => sum + product.price * product.quantity, // حساب المجموع بناءً على السعر والكمية
            0
          );

          return {
            products: updatedProducts,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          };
        });
      },

      removeFromCart(item) {
        set((state) => {
          const updatedProducts = state.products.filter(
            (product) => product.id !== item.id
          );

          // إعادة حساب إجمالي عدد المنتجات بعد إزالة المنتج
          const newTotalItems = updatedProducts.reduce(
            (sum, product) => sum + product.quantity,
            0
          );
          const newTotalPrice = updatedProducts.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0
          );

          return {
            products: updatedProducts,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          };
        });
      },

      clearCart() {
        set(() => ({
          products: [],
          totalItems: 0,
          totalPrice: 0, // Reset the price after clearing the cart
        }));
      },
    }),
    { name: "cart", skipHydration: true }
  )
);

type LoadingStoreType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<LoadingStoreType>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
