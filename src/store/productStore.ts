import { create } from 'zustand';
import type { Producto, Categoria } from '../types';

interface ProductState {
  // Catálogo
  productos: Producto[];
  categorias: Categoria[];
  categoriaActiva: number | null;
  searchQuery: string;

  // Paginación
  page: number;
  pageSize: number;
  total: number;

  // Producto seleccionado (detalle)
  productoSeleccionado: Producto | null;

  // Acciones
  setProductos: (productos: Producto[]) => void;
  setCategorias: (categorias: Categoria[]) => void;
  setCategoriaActiva: (id: number | null) => void;
  setSearchQuery: (q: string) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setProductoSeleccionado: (producto: Producto | null) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  productos: [],
  categorias: [],
  categoriaActiva: null,
  searchQuery: '',
  page: 1,
  pageSize: 12,
  total: 0,
  productoSeleccionado: null,

  setProductos: (productos) => set({ productos }),
  setCategorias: (categorias) => set({ categorias }),
  setCategoriaActiva: (id) => set({ categoriaActiva: id, page: 1 }),
  setSearchQuery: (q) => set({ searchQuery: q, page: 1 }),
  setPage: (page) => set({ page }),
  setTotal: (total) => set({ total }),
  setProductoSeleccionado: (producto) => set({ productoSeleccionado: producto }),

  resetFilters: () =>
    set({
      categoriaActiva: null,
      searchQuery: '',
      page: 1,
      productoSeleccionado: null,
    }),
}));
