export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: number | null;
  es_activa: boolean;
  es_principal?: boolean;
  subcategorias?: Categoria[];
}

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_adicional: number;
  imagen_url?: string;
  disponible: boolean;
  alergeno?: boolean;
}

export interface CategoriaNested {
  id: number;
  nombre: string;
  imagen_url?: string;
  es_principal: boolean;
}

export interface IngredienteNested {
  id: number;
  nombre: string;
  precio_adicional: number;
  imagen_url?: string;
  alergeno?: boolean;
}

export interface Variante {
  id: number;
  tipo: string; // "talle" | "color"
  valor: string;
  precio_adicional: number;
  stock: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  imagenes_url?: string;
  stock_cantidad: number;
  disponible: boolean;
  created_at: string;
  updated_at: string;
  categorias: CategoriaNested[];
  ingredientes: IngredienteNested[];
  variantes: Variante[];
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  created_at: string;
}

export interface PedidoDetalle {
  id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  nombre_producto?: string;
  variante_id?: number;
  variante_nombre?: string;
  notas?: string;
}

/** Datos mínimos para crear un detalle de pedido (sin id ni precio, se generan en backend) */
export interface PedidoDetalleCreate {
  producto_id: number;
  cantidad: number;
  variante_id?: number;
  variante_nombre?: string;
  notas?: string;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  estado: string;
  total: number;
  usuario_nombre?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
  detalles: PedidoDetalle[];
}

/** Datos para crear un pedido (lo que envía el frontend) */
export interface PedidoCreateData {
  usuario_id: number;
  detalles: PedidoDetalleCreate[];
  notas?: string;
}

// ─── MercadoPago ───────────────────────────────────────────────

export interface CreatePreferenceResponse {
  mp_preference_id: string;
  init_point: string;
  idempotency_key: string;
}

// ─── Pagos ─────────────────────────────────────────────────────

export interface PagoResponse {
  id: number;
  pedido_id: number;
  mp_payment_id: string | null;
  mp_status: string;
  mp_status_detail: string | null;
  transaction_amount: number;
  currency_id: string;
  payment_method: string;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
}

// ─── Cloudinary ────────────────────────────────────────────────

export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface CloudinaryDestroyResponse {
  result: string;
}

// ─── Estadísticas ──────────────────────────────────────────────

export interface EstadisticasTotales {
  total_pedidos: number;
  total_productos: number;
  total_clientes: number;
  total_ingredientes: number;
  total_categorias: number;
}

export interface PedidoPeriodoItem {
  fecha: string;
  cantidad: number;
  total: number;
}

export interface PedidosPeriodoResponse {
  pedidos: PedidoPeriodoItem[];
}

export interface PlataformaMasVendida {
  producto_id: number;
  nombre: string;
  total_vendido: number;
}

export interface TicketPromedio {
  promedio: number;
  total_pedidos: number;
  ingresos_totales: number;
}

export interface RankingProductoItem {
  producto_id: number;
  nombre: string;
  total_vendido: number;
  ingresos: number;
}

export interface RankingProductosResponse {
  ranking: RankingProductoItem[];
}

export interface PedidoPorEstadoItem {
  estado: string;
  cantidad: number;
}

export interface PedidosPorEstadoResponse {
  pedidos: PedidoPorEstadoItem[];
}

export interface IngresosResponse {
  total_ingresos: number;
  cantidad_pedidos: number;
  promedio: number;
}
