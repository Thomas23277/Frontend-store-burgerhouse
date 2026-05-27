import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio_base: number;
  cantidad: number;
  imagen_url?: string;
  stock_cantidad: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cantidad'>) => void;
  removeItem: (producto_id: number) => void;
  updateCantidad: (producto_id: number, cantidad: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.producto_id === item.producto_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.producto_id === item.producto_id
                  ? { ...i, cantidad: Math.min(i.cantidad + 1, item.stock_cantidad) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad: 1 }] };
        });
      },

      removeItem: (producto_id) => {
        set((state) => ({
          items: state.items.filter((i) => i.producto_id !== producto_id),
        }));
      },

      updateCantidad: (producto_id, cantidad) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.producto_id === producto_id
              ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock_cantidad)) }
              : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        return get().items.reduce((sum, i) => sum + i.precio_base * i.cantidad, 0);
      },

      itemCount: () => {
        return get().items.reduce((sum, i) => sum + i.cantidad, 0);
      },
    }),
    {
      name: 'burgerhouse-cart',
      // Only persist serializable data (functions excluded)
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
