import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import StoreHome from '../pages/StoreHome';
import Catalogo from '../pages/Catalogo';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import MisPedidos from '../pages/MisPedidos';
import DetalleProducto from '../pages/DetalleProducto';
import PagoExitoso from '../pages/PagoExitoso';
import PagoFallido from '../pages/PagoFallido';
import AdminEstadisticas from '../pages/AdminEstadisticas';

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
