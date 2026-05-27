import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategorias } from '../services/categorias';
import { getProductosDestacados } from '../services/productos';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function StoreHome() {
  const { data: categorias, isLoading: catLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  });

  const { data: destacados, isLoading: destLoading } = useQuery({
    queryKey: ['productos-destacados'],
    queryFn: () => getProductosDestacados(6),
  });

  return (
    <div className="min-h-screen">
      {/* ════════════════════════════════════════
          HERO SECTION — Épico
          ════════════════════════════════════════ */}
      <section className="hero-gradient text-white py-28 md:py-36 px-4 relative overflow-hidden">
        {/* Elementos decorativos flotantes */}
        <div className="absolute top-20 left-10 text-7xl md:text-9xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>🍔</div>
        <div className="absolute bottom-20 right-10 text-6xl md:text-8xl opacity-10 animate-float2" style={{ animationDelay: '0.5s' }}>🍟</div>
        <div className="absolute top-1/3 right-1/4 text-5xl md:text-7xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🥤</div>
        <div className="absolute bottom-1/4 left-1/4 text-4xl md:text-6xl opacity-10 animate-float2" style={{ animationDelay: '1.5s' }}>🧀</div>
        
        {/* Círculos de luz */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[100px]" />

        <div className="px-4 md:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 animate-fadeInDown">
            <span className="badge badge-amber text-sm px-4 py-1.5">
              🔥 Las mejores hamburguesas de la ciudad
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none animate-fadeInUp">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Burger House
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Hamburguesas artesanales hechas con los mejores ingredientes.
            <br className="hidden md:block" />
            Carne angus 100% de res, pan brioche artesanal y nuestras salsas secretas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/catalogo"
              className="btn-primary text-lg px-10 py-4 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 justify-center"
            >
              Ver Menú 🚀
            </Link>
            <Link
              to="/catalogo?categoria_id=1"
              className="glass-light text-gray-300 font-medium text-lg px-10 py-4 rounded-xl hover:text-white hover:bg-white/10 transition-all justify-center flex items-center gap-2"
            >
              Hamburguesas 🍔
            </Link>
          </div>
        </div>

        {/* Ola decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f0f1a] to-transparent" />
      </section>

      {/* ════════════════════════════════════════
          CATEGORÍAS
          ════════════════════════════════════════ */}
      {categorias && categorias.length > 0 && (
        <section className="px-4 md:px-6 lg:px-8 py-20 stagger">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Nuestras Categorías
              </span>
            </h2>
            <p className="text-gray-500">Explorá por tipo de producto</p>
          </div>

          {catLoading ? (
            <LoadingSpinner text="Cargando categorías..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalogo?categoria_id=${cat.id}`}
                  className="card p-6 md:p-8 text-center group hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden ring-2 ring-white/5 group-hover:ring-amber-500/30 transition-all duration-300">
                    {cat.imagen_url ? (
                      <img src={cat.imagen_url} alt={cat.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-2xl">
                        🍔
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {cat.nombre}
                  </h3>
                  {cat.descripcion && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{cat.descripcion}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ════════════════════════════════════════
          DESTACADOS
          ════════════════════════════════════════ */}
      <section className="border-t border-white/5 py-20">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge badge-amber mb-4 inline-block">⭐ Lo más popular</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Productos Destacados
              </span>
            </h2>
            <p className="text-gray-500">Los favoritos de nuestros clientes</p>
          </div>

          {destLoading ? (
            <LoadingSpinner text="Cargando productos..." />
          ) : destacados && destacados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {destacados.map((prod, idx) => (
                <Link
                  key={prod.id}
                  to={`/productos/${prod.id}`}
                  className="card overflow-hidden group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Imagen */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                    {prod.imagenes_url ? (
                      <img src={prod.imagenes_url} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl animate-float">
                        🍔
                      </div>
                    )}
                    {/* Overlay con precio */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <span className="text-amber-400 font-bold text-lg">
                        ${(prod.precio_base || 0).toLocaleString()}
                      </span>
                    </div>
                    {/* Badge categoría */}
                    {prod.categorias?.[0] && (
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-amber text-xs">
                          {prod.categorias[0].nombre}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors mb-2">
                      {prod.nombre}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {prod.descripcion}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className={`text-xs font-medium ${prod.disponible && prod.stock_cantidad > 0 ? 'badge-green' : 'badge-red'}`}>
                        {!prod.disponible ? '✕ No disponible' : prod.stock_cantidad === 0 ? '✕ Sin Stock' : '✓ Disponible'}
                      </span>
                      <span className="text-gray-500 text-sm group-hover:text-amber-400 transition-colors flex items-center gap-1">
                        Ver detalle →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4 animate-float">🍔</span>
              <h3 className="text-xl text-gray-300 font-semibold mb-2">Próximamente...</h3>
              <p className="text-gray-500">Estamos preparando algo delicioso para vos</p>
            </div>
          )}

          <div className="text-center mt-12 animate-fadeInUp">
            <Link
              to="/catalogo"
              className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2"
            >
              Ver Todo el Menú <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
