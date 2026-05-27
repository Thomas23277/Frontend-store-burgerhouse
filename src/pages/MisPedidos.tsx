import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMisPedidos } from '../services/pedidos';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import EstadoTimeline from '../components/EstadoTimeline';

const estadoColores: Record<string, string> = {
  pendiente: 'badge-yellow',
  confirmado: 'badge-blue',
  en_prep: 'badge-purple',
  en_camino: 'badge-orange',
  entregado: 'badge-green',
  cancelado: 'badge-red',
};

const estadoLabels: Record<string, string> = {
  pendiente: '⏳ Pendiente',
  confirmado: '✅ Confirmado',
  en_prep: '👨‍🍳 En preparación',
  en_camino: '🚚 En camino',
  entregado: '🎉 Entregado',
  cancelado: '❌ Cancelado',
};

export default function MisPedidos() {
  const { data: pedidos, isLoading } = useQuery({
    queryKey: ['mis-pedidos'],
    queryFn: getMisPedidos,
  });

  const [timelineOpen, setTimelineOpen] = useState<Record<number, boolean>>({});

  if (isLoading) return <LoadingSpinner text="Cargando pedidos..." />;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              📦 Mis Pedidos
            </span>
          </h1>
          <p className="text-gray-500 text-lg">Historial de tus pedidos</p>
        </div>

        {!pedidos || pedidos.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No tenés pedidos todavía"
            subtitle="Realizá tu primer pedido desde el catálogo"
            action={
              <Link
                to="/catalogo"
                className="btn-primary text-lg px-8 py-3 inline-flex mt-4"
              >
                Ver productos
              </Link>
            }
          />
        ) : (
          <div className="space-y-4 stagger">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="card p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-xl text-white">
                        Pedido #{pedido.id}
                      </h3>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          estadoColores[pedido.estado] ?? 'badge-gray'
                        }`}
                      >
                        {estadoLabels[pedido.estado] || pedido.estado}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(pedido.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-amber-400 font-black text-2xl md:text-3xl">
                    ${(pedido.total || 0).toLocaleString()}
                  </p>
                </div>

                {pedido.detalles && pedido.detalles.length > 0 && (
                  <div className="border-t border-white/5 pt-4 mt-4">
                    <p className="text-sm font-medium text-gray-400 mb-3">
                      Productos:
                    </p>
                    <div className="space-y-2">
                      {pedido.detalles.map((d) => (
                        <div
                          key={d.id}
                          className="flex justify-between items-center text-sm bg-white/5 rounded-xl px-4 py-2.5"
                        >
                          <span className="text-gray-300">
                            <span className="text-amber-400 font-medium">{d.cantidad}x</span>{' '}
                            {d.nombre_producto || `Producto #${d.producto_id}`}
                          </span>
                          <span className="text-gray-400 font-medium">
                            ${(d.precio_unitario * d.cantidad).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline toggle */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setTimelineOpen((prev) => ({ ...prev, [pedido.id]: !prev[pedido.id] }))}
                    className="text-sm text-gray-500 hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="transition-transform" style={{ transform: timelineOpen[pedido.id] ? 'rotate(90deg)' : '' }}>
                      ▶
                    </span>
                    <span>Ver historial de cambios</span>
                  </button>
                  {timelineOpen[pedido.id] && (
                    <div className="mt-3 pl-2">
                      <EstadoTimeline pedidoId={pedido.id} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
