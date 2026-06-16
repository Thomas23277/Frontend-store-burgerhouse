import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio_base: number;
  precio_final: number; // precio_base + precio_adicional de variante
  cantidad: number;
  imagen_url?: string;
  stock_cantidad: number;
  variante_id?: number;
  variante_nombre?: string;
  /** Clave única por producto+variante para permitir mismo producto con distintas variantes */
  cart_key: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cantidad' | 'cart_key'>) => void;
  removeItem: (cart_key: string) => void;
  updateCantidad: (cart_key: string, cantidad: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const cartKey = `${item.producto_id}-${item.variante_id ?? 'novar'}`;
        set((state) => {
          const existing = state.items.find((i) => i.cart_key === cartKey);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cart_key === cartKey
                  ? { ...i, cantidad: Math.min(i.cantidad + 1, item.stock_cantidad) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad: 1, cart_key: cartKey }] };
        });
      },

      removeItem: (cart_key) => {
        set((state) => ({
          items: state.items.filter((i) => i.cart_key !== cart_key),
        }));
      },

      updateCantidad: (cart_key, cantidad) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cart_key === cart_key
              ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock_cantidad)) }
              : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        return get().items.reduce((sum, i) => sum + i.precio_final * i.cantidad, 0);
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
