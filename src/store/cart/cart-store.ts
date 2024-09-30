import { create } from "zustand";
import type { CartProduct } from "@/interfaces/product.interface";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  //updateQuantity
  //removeProductFromCart
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      //methods
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
    }),
    {
      name: "cart-storage",
      //skipHydration: true, esto se puede usar para evitar el problema de hidratacion en el servidor, pero hay que hacer las el I/O de localstorage manual
    }
  )
);
