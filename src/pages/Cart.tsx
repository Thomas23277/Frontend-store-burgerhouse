import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { createPedido } from '../services/pedidos';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Cart() {
  const { items, removeItem, updateCantidad, clearCart, total, itemCount } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    setCheckingOut(true);
    setError('');
    try {
      await createPedido({
        usuario_id: user.id,
        detalles: items.map((i) => ({
          producto_id: i.producto_id,
          cantidad: i.cantidad,
        })),
      });
      clearCart();
      navigate('/mis-pedidos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear pedido');
    } finally {
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center animate-fadeInUp">
          <span className="text-8xl block mb-6 animate-float">🛒</span>
          <h2 className="text-2xl font-bold text-white mb-2">Carrito vacío</h2>
          <p className="text-gray-400 mb-6">No tenés productos en el carrito todavía.</p>
          <Link to="/catalogo" className="btn-primary inline-flex text-lg px-8 py-3">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                🛒 Carrito
              </span>
            </h1>
            <p className="text-gray-500">{itemCount()} producto(s) en tu carrito</p>
          </div>
          <button
            onClick={clearCart}
            className="btn-secondary text-sm"
          >
            Vaciar carrito
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fadeInUp">
            {error}
          </div>
        )}

        {/* Items */}
        <div className="space-y-4 stagger">
          {items.map((item) => (
            <div
              key={item.producto_id}
              className="card p-4 md:p-6 flex items-center gap-4 md:gap-6"
            >
              {item.imagen_url ? (
                <img src={item.imagen_url} alt={item.nombre} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-3xl flex-shrink-0">
                  🍔
                </div>
              )}

              <div className="flex-1 min-w-0">
                <Link to={`/productos/${item.producto_id}`} className="font-semibold text-white hover:text-amber-400 transition-colors">
                  {item.nombre}
                </Link>
                <p className="text-amber-400 font-bold mt-1">
                  ${(item.precio_base * item.cantidad).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCantidad(item.producto_id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 font-bold text-white transition cursor-pointer disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-white">{item.cantidad}</span>
                <button
                  onClick={() => updateCantidad(item.producto_id, item.cantidad + 1)}
                  disabled={item.cantidad >= item.stock_cantidad}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 font-bold text-white transition cursor-pointer disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.producto_id)}
                className="text-gray-500 hover:text-red-400 text-xl transition cursor-pointer flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Total + Checkout */}
        <div className="card p-6 mt-8 animate-fadeInUp">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-white">Total</span>
            <span className="text-3xl md:text-4xl font-black text-amber-400">
              ${total().toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkingOut || items.length === 0}
            className="w-full btn-primary justify-center text-lg py-4 disabled:opacity-50"
          >
            {checkingOut
              ? 'Creando pedido... ⌛'
              : isAuthenticated
                ? 'Realizar Pedido 🚀'
                : 'Iniciar sesión para comprar'}
          </button>
        </div>
      </div>
    </div>
  );
}
