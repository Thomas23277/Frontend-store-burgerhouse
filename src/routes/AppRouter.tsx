import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import StoreHome from '../features/home/StoreHome';
import Catalogo from '../features/catalog/Catalogo';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Cart from '../features/cart/Cart';
import MisPedidos from '../features/orders/MisPedidos';
import MisDirecciones from '../features/addresses/MisDirecciones';
import DetalleProducto from '../features/catalog/DetalleProducto';
import PagoExitoso from '../features/payments/PagoExitoso';
import PagoFallido from '../features/payments/PagoFallido';
import AdminEstadisticas from '../features/admin/AdminEstadisticas';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<StoreHome />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pago/exito" element={<PagoExitoso />} />
          <Route path="/pago/fallo" element={<PagoFallido />} />

          {/* Protected: user */}
          <Route
            path="/mis-pedidos"
            element={
              <ProtectedRoute requireAuth>
                <MisPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-direcciones"
            element={
              <ProtectedRoute requireAuth>
                <MisDirecciones />
              </ProtectedRoute>
            }
          />

          {/* Protected: admin */}
          <Route
            path="/admin/estadisticas"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminEstadisticas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
