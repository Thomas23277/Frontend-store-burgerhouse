import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductos } from '../services/productos';
import { getCategorias } from '../services/categorias';
import { useCartStore } from '../store/cartStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState<number | null>(
    searchParams.get('categoria_id') ? Number(searchParams.get('categoria_id')) : null
  );
  const [showDisponible, setShowDisponible] = useState(true);

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos', selectedCat, search, showDisponible],
    queryFn: () =>
      getProductos({
        categoria_id: selectedCat ?? undefined,
        search: search || undefined,
        disponible: showDisponible ? true : undefined,
      }),
  });

  // Filtro adicional por stock cuando "Solo disponibles" está activado
  const productosFiltrados = showDisponible
    ? productos?.filter((p) => p.stock_cantidad > 0)
    : productos;

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (selectedCat) params.categoria_id = String(selectedCat);
    setSearchParams(params, { replace: true });
  }, [search, selectedCat, setSearchParams]);

  const handleAdd = (prod: NonNullable<typeof productos>[number]) => {
    addItem({
      producto_id: prod.id,
      nombre: prod.nombre,
      precio_base: prod.precio_base,
      imagen_url: prod.imagenes_url,
      stock_cantidad: prod.stock_cantidad,
    });
    setAddedMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [prod.id]: false })), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-10 pb-4">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Nuestro Menú
            </span>
          </h1>
          <p className="text-gray-500 text-lg">Elegí tus productos favoritos</p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6 animate-fadeInUp">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={showDisponible}
                onChange={(e) => setShowDisponible(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-white/5 text-amber-500 focus:ring-amber-500/30 cursor-pointer"
              />
              Solo disponibles
            </label>
          </div>
        </div>

        {/* Category cards */}
        {categorias && categorias.length > 0 && (
          <div className="card p-5 mb-10 animate-fadeInUp">
            <div className="flex gap-5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCat(null)}
                className={`relative flex-shrink-0 w-36 md:w-44 h-28 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group ${
                  selectedCat === null
                    ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-[#1a1a1a] scale-[1.02]'
                    : 'hover:scale-[1.02] hover:ring-1 hover:ring-white/20'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/40 to-amber-900/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">🍽️</span>
                  <span className="text-white font-bold text-sm">Todas</span>
                </div>
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id === selectedCat ? null : cat.id)}
                  className={`relative flex-shrink-0 w-36 md:w-44 h-28 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group ${
                    selectedCat === cat.id
                      ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-[#1a1a1a] scale-[1.02]'
                      : 'hover:scale-[1.02] hover:ring-1 hover:ring-white/20'
                  }`}
                >
                  {/* Background image or gradient */}
                  {cat.imagen_url ? (
                    <img
                      src={cat.imagen_url}
                      alt={cat.nombre}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-amber-800/40" />
                  )}
                  {/* Overlay gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1">
                    <span className="text-3xl">🍔</span>
                    <span className="text-white font-bold text-sm leading-tight text-center px-2">
                      {cat.nombre}
                    </span>
                  </div>
                  {/* Active indicator */}
                  {selectedCat === cat.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section separator */}
        <div className="flex items-center gap-3 mt-2 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-sm font-medium text-gray-500 tracking-widest uppercase flex items-center gap-2">
            🍔 Menú
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <LoadingSpinner text="Buscando productos..." />
        ) : productosFiltrados && productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((prod) => (
              <div
                key={prod.id}
                className="card overflow-hidden group"
              >
                <Link to={`/productos/${prod.id}`}>
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                    {prod.imagenes_url ? (
                      <img src={prod.imagenes_url} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">🍔</div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <span className="text-amber-400 font-bold">
                        ${(prod.precio_base || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <Link to={`/productos/${prod.id}`} className="hover:text-amber-400 transition-colors">
                    <h3 className="font-bold text-lg text-white">{prod.nombre}</h3>
                  </Link>
                  <p className="text-gray-400 text-sm line-clamp-2 mt-1 mb-3">{prod.descripcion}</p>

                  {/* Categorías badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prod.categorias?.slice(0, 3).map((cat) => (
                      <span key={cat.id} className="badge badge-amber text-[10px]">
                        {cat.nombre}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className={`text-xs font-medium ${prod.disponible && prod.stock_cantidad > 0 ? 'badge-green' : 'badge-red'}`}>
                      {!prod.disponible ? '✕ No disponible' : prod.stock_cantidad === 0 ? '✕ Sin Stock' : `✓ Stock: ${prod.stock_cantidad}`}
                    </span>
                    <button
                      onClick={() => handleAdd(prod)}
                      disabled={!prod.disponible || prod.stock_cantidad <= 0}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer disabled:cursor-not-allowed ${
                        addedMap[prod.id]
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'btn-primary text-sm disabled:opacity-30'
                      }`}
                    >
                      {addedMap[prod.id] ? '✓ Agregado' : '+ Carrito'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="Sin resultados"
            subtitle={search || selectedCat ? 'Probá con otros filtros o búsqueda' : 'No hay productos disponibles todavía'}
          />
        )}
      </div>
    </div>
  );
}
