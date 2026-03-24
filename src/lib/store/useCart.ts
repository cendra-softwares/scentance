import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: string | number;
  image: string;
  quantity: number;
  variantLabel?: string | null;
  category?: string;
  volume?: string | null;
}

interface CartState {
  items: CartItem[];
  forceCartUp: boolean;
  addItem: (item: CartItemInput) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  setForceCartUp: (value: boolean) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

/**
 * Input type for adding items to cart (flexible input before normalization)
 */
interface CartItemInput {
  id: string | number;
  name: string;
  price?: string | number;
  image?: string;
  base_price?: string | number;
  featured_image?: string;
  volume?: string | null;
  variantLabel?: string | null;
  category?: string | { name?: string } | null;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      forceCartUp: false,
      addItem: (item) => {
        const items = get().items;
        // For new system, we'll use a combination of id and variantLabel to find uniqueness
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          // Normalize the item for the cart
          const categoryValue = typeof item.category === 'object' ? item.category?.name : item.category;
          const newItem: CartItem = {
            id: item.id,
            name: item.name || 'Unknown Product',
            price: item.price || item.base_price || 0,
            image: item.image || item.featured_image || '',
            quantity: 1,
            variantLabel: item.volume || item.variantLabel || undefined,
            category: categoryValue || undefined
          };
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setForceCartUp: (value: boolean) => set({ forceCartUp: value }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => {
        return get().items.reduce((acc, item) => {
          const priceStr = typeof item.price === 'string' 
            ? item.price.replace(/[^\d]/g, '') 
            : item.price.toString();
          const price = parseInt(priceStr) || 0;
          return acc + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'scentance-cart',
    }
  )
);
