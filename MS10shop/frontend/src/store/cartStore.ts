"use client";

import { create } from "zustand";
import { cartAPI } from "@/lib/api";
import { Cart, CartItem } from "@/types";

interface CartStore {
  cart: Cart | null;
  total: number;
  itemCount: number;
  isLoading: boolean;
  isOpen: boolean;
  setCart: (cart: Cart, total: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, size: string, quantity: number, customization?: { customName?: string; customNumber?: number; customizationPrice?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + (price + (item.customizationPrice || 0)) * item.quantity;
  }, 0);

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  total: 0,
  itemCount: 0,
  isLoading: false,
  isOpen: false,

  setCart: (cart, total) =>
    set({
      cart,
      total,
      itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    }),

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const { data } = await cartAPI.getCart();
      set({
        cart: data.cart,
        total: data.total,
        itemCount: data.cart?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, size, quantity, customization) => {
    try {
      set({ isLoading: true });
      const { data } = await cartAPI.addToCart({
        productId,
        size,
        quantity,
        ...customization,
      });
      set({
        cart: data.cart,
        total: data.total,
        itemCount: data.cart?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0,
        isLoading: false,
        isOpen: true,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      set({ isLoading: true });
      const { data } = await cartAPI.updateCartItem(itemId, quantity);
      set({
        cart: data.cart,
        total: data.total,
        itemCount: data.cart?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    try {
      set({ isLoading: true });
      const { data } = await cartAPI.removeFromCart(itemId);
      set({
        cart: data.cart,
        total: data.total,
        itemCount: data.cart?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      await cartAPI.clearCart();
      set({ cart: null, total: 0, itemCount: 0 });
    } catch {}
  },
}));
