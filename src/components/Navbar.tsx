import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';

const publicLinks = [
  { path: '/', label: 'Inicio', exact: true },
  { path: '/catalogo', label: 'Menú' },
];

export default function Navbar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const itemCount = useCartStore((s) => s.itemCount);
  const cartCount = itemCount();

  const isActive = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const roleBadge = (rol: string | undefined) => {
    if (!rol) return null;
    const colors: Record<string, string> = {
      admin: 'badge-amber',
      pedidos: 'badge-blue',
      stock: 'badge-green',
    };
    return (
      <span className={`badge ${colors[rol.toLowerCase()] ?? 'badge-gray'}`}>
        {rol.toUpperCase()}
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🍔</span>
            <span className="font-bold text-lg bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Burger House
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive(link.path, link.exact)
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/cart')
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg animate-scaleIn">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mis Pedidos */}
            {isAuthenticated && (
              <Link
                to="/mis-pedidos"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/mis-pedidos')
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Mis Pedidos
              </Link>
            )}

            {/* Admin */}
            {isAuthenticated && user?.rol?.toUpperCase() === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/admin')
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Admin
              </Link>
            )}

            {/* Employee Panel */}
            {isAuthenticated && ['PEDIDOS', 'STOCK'].includes(user?.rol?.toUpperCase() ?? '') && (
              <Link
                to="/empleado"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/empleado')
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Panel
              </Link>
            )}

            {/* Auth */}
            <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-300 text-sm font-medium hidden lg:block">
                      {user.nombre}
                    </span>
                    {roleBadge(user.rol)}
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-amber-400 text-sm font-medium transition cursor-pointer"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary text-sm"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link to={user.rol === 'ADMIN' ? '/admin' : '/empleado'} className="text-gray-300 text-sm p-2 hover:text-white">
                  🧑‍💼
                </Link>
                <button onClick={logout} className="text-gray-400 text-sm p-2 hover:text-amber-400 cursor-pointer">
                  ✕
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-1.5 px-3">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
