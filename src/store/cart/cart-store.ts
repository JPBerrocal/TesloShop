import { create } from "zustand";
import type { CartProduct } from "@/interfaces/product.interface";

interface State {
  cart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
  //updateQuantity
  //removeProductFromCart
}

export const useCartStore = create<State>()((set, get) => ({
  cart: [],

  //methods
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
}));
