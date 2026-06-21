import { Link, useSearchParams } from 'react-router-dom';

export default function PagoExitoso() {
  const [params] = useSearchParams();
  const pedidoId = params.get('pedido_id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center animate-fadeInUp max-w-md">
        <span className="text-8xl block mb-6">✅</span>
        <h1 className="text-3xl md:text-4xl font-black mb-4">
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            ¡Pago Exitoso!
          </span>
        </h1>
        <p className="text-gray-400 mb-2 text-lg">
          Tu pago fue procesado correctamente.
        </p>
        {pedidoId && (
          <p className="text-gray-500 text-sm mb-8">
            Pedido #{pedidoId}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            to="/mis-pedidos"
            className="btn-primary text-lg px-8 py-3 inline-flex justify-center"
          >
            Ver mis pedidos 📦
          </Link>
          <Link
            to="/catalogo"
            className="btn-secondary text-lg px-8 py-3 inline-flex justify-center"
          >
            Seguir comprando 🛍️
          </Link>
        </div>
      </div>
    </div>
  );
}
