import { create } from "zustand";
import type { CartProduct } from "@/interfaces/product.interface";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInformation: () => {
    totalItems: number;
    subTotal: number;
    taxes: number;
    total: number;
  };
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      //methods
      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (subTotal, product) => subTotal + product.quantity * product.price,
          0
        );

        const taxes = subTotal * 0.15;

        const total = subTotal + taxes;

        const totalItems = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return { totalItems, subTotal, taxes, total };
      },
      getTotalItems: () => {
        const { cart } = get();

        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();
        //1. revisar si el producto ya existe en el carrito

        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (productInCart) {
          set({
            cart: cart.map((item) => {
              if (item.id === product.id && item.size === product.size) {
                return {
                  ...item,
                  quantity: item.quantity + product.quantity,
                };
              }
              return item;
            }),
          });
        } else {
          set({ cart: [...cart, product] });
        }
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        set({
          cart: cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
              return {
                ...item,
                quantity,
              };
            }
            return item;
          }),
        });
      },

      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();

        const updatedCart = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );

        set({ cart: updatedCart });
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),

    {
      name: "cart-storage",
      //skipHydration: true, esto se puede usar para evitar el problema de hidratacion en el servidor, pero hay que hacer las el I/O de localstorage manual
    }
  )
);
