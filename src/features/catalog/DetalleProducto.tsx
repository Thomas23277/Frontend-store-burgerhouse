import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducto } from '../../services/productos';
import { useCartStore } from '../../store/cartStore';
import type { Variante } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const productoId = parseInt(id || '0');
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [selectedVarianteId, setSelectedVarianteId] = useState<number | null>(null);

  const { data: producto, isLoading, error } = useQuery({
    queryKey: ['producto', productoId],
    queryFn: () => getProducto(productoId),
    enabled: productoId > 0,
  });

  // Agrupar variantes por tipo
  const variantesByType = useMemo(() => {
    if (!producto?.variantes?.length) return {};
    const groups: Record<string, Variante[]> = {};
    for (const v of producto.variantes) {
      if (!groups[v.tipo]) groups[v.tipo] = [];
      groups[v.tipo].push(v);
    }
    return groups;
  }, [producto]);

  const hasVariantes = producto?.variantes && producto.variantes.length > 0;

  // Variante seleccionada (objeto completo)
  const selectedVariante = useMemo(() => {
    if (!selectedVarianteId || !producto?.variantes) return null;
    return producto.variantes.find((v) => v.id === selectedVarianteId) ?? null;
  }, [selectedVarianteId, producto]);

  const precioFinal = producto
    ? producto.precio_base + (selectedVariante?.precio_adicional ?? 0)
    : 0;

  // Stock disponible (si tiene variante seleccionada, usa stock de esa variante)
  const stockDisponible = selectedVariante
    ? selectedVariante.stock
    : (producto?.stock_cantidad ?? 0);

  const puedeAgregar = producto?.disponible && stockDisponible > 0
    && (!hasVariantes || selectedVarianteId !== null);

  const handleAdd = () => {
    if (!producto || !puedeAgregar) return;
    addItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_base: producto.precio_base,
      precio_final: precioFinal,
      imagen_url: producto.imagenes_url,
      stock_cantidad: stockDisponible,
      variante_id: selectedVariante?.id,
      variante_nombre: selectedVariante?.valor,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) return <LoadingSpinner text="Cargando producto..." />;

  if (error || !producto) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto card p-12 text-center">
          <div className="text-7xl mb-6 animate-float">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
          <p className="text-gray-400 mb-6">El producto que buscas no existe o fue eliminado.</p>
          <Link to="/catalogo" className="btn-primary inline-flex">
            ← Volver al menú
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        <Link to="/catalogo" className="text-gray-400 hover:text-amber-400 transition-colors mb-6 inline-flex items-center gap-1">
          ← Volver al menú
        </Link>

        <div className="card overflow-hidden">
          {/* Imagen hero */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-amber-500/15 to-amber-600/5">
            {producto.imagenes_url ? (
              <img src={producto.imagenes_url} alt={producto.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl animate-float">🍔</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e32] via-transparent to-transparent" />
            {/* Precio flotante */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
              <span className="text-3xl md:text-4xl font-black text-amber-400">
                ${precioFinal.toLocaleString()}
              </span>
              {selectedVariante && selectedVariante.precio_adicional > 0 && (
                <span className="block text-xs text-gray-400 text-right">
                  base ${producto.precio_base.toLocaleString()} + ${selectedVariante.precio_adicional.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{producto.nombre}</h1>
                <p className="text-gray-400 text-lg">{producto.descripcion}</p>
              </div>
            </div>

            {/* === SELECTOR DE VARIANTES === */}
            {hasVariantes && (
              <div className="mb-8 space-y-5">
                {Object.entries(variantesByType).map(([tipo, variantes]) => (
                  <div key={tipo}>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      {tipo === 'talle' ? 'Talles' : tipo === 'color' ? 'Colores' : tipo}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variantes.map((v) => {
                        const isSelected = selectedVarianteId === v.id;
                        const isOutOfStock = v.stock <= 0;
                        const isColor = tipo === 'color';
                        return (
                          <button
                            key={v.id}
                            onClick={() => !isOutOfStock && setSelectedVarianteId(v.id)}
                            disabled={isOutOfStock}
                            title={isOutOfStock ? 'Sin stock' : v.valor}
                            className={`
                              relative px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer
                              disabled:cursor-not-allowed disabled:opacity-40
                              ${isSelected
                                ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500 shadow-lg shadow-amber-500/10'
                                : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20 hover:text-white'
                              }
                              ${isColor ? 'pl-10' : ''}
                            `}
                          >
                            {/* Color swatch */}
                            {isColor && (
                              <span
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/20"
                                style={{ backgroundColor: v.valor.toLowerCase() }}
                              />
                            )}
                            {v.valor}
                            {v.precio_adicional > 0 && (
                              <span className="ml-1 text-amber-400 text-xs">+${v.precio_adicional}</span>
                            )}
                            {isOutOfStock && (
                              <span className="ml-1 text-red-400 text-xs">(sin stock)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {selectedVarianteId === null && (
                  <p className="text-xs text-amber-400/70">Seleccioná una variante para agregar al carrito</p>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Categorías */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.categorias?.length > 0 ? (
                    producto.categorias.map((cat) => (
                      <span key={cat.id} className={`badge ${cat.es_principal ? 'badge-amber' : 'badge-gray'}`}>
                        {cat.nombre} {cat.es_principal && '⭐'}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Sin categoría</span>
                  )}
                </div>
              </div>

              {/* Ingredientes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.ingredientes?.length > 0 ? (
                    producto.ingredientes.map((ing) => (
                      <span key={ing.id} className={`badge ${ing.alergeno ? 'badge-amber' : 'badge-green'}`}>
                        {ing.alergeno && '⚠️ '}{ing.nombre} {ing.precio_adicional > 0 && `(+$${ing.precio_adicional})`}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Sin ingredientes</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex gap-3">
                <span className={`badge ${producto.disponible && stockDisponible > 0 ? 'badge-green' : 'badge-red'}`}>
                  {!producto.disponible ? '✕ No disponible' : stockDisponible === 0 ? '✕ Sin Stock' : '✓ Disponible'}
                </span>
                <span className="badge badge-gray">
                  Stock: {stockDisponible}
                </span>
              </div>
              <button
                onClick={handleAdd}
                disabled={!puedeAgregar}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all cursor-pointer disabled:cursor-not-allowed ${
                  added
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'btn-primary disabled:opacity-30'
                }`}
              >
                {added
                  ? '✓ Agregado al carrito'
                  : hasVariantes && selectedVarianteId === null
                    ? 'Seleccioná una variante'
                    : 'Agregar al Carrito 🛒'}
              </button>
            </div>

            {/* Metadatos */}
            <div className="mt-6 text-xs text-gray-600 space-y-1">
              <p>ID: {producto.id}</p>
              <p>Creado: {new Date(producto.created_at).toLocaleString()}</p>
              <p>Actualizado: {new Date(producto.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
