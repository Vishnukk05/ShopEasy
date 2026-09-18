import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistState {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('wishlist') || '[]') : [],
  
  addItem: (item) => {
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) return state;
      const newItems = [...state.items, item];
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  isInWishlist: (id) => {
    return get().items.some((i) => i.id === id);
  }
}));
