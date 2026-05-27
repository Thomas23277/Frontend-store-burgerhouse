# 🏪 Burger House — Frontend Store

Frontend público de **Burger House** para clientes. Catálogo, carrito con persistencia, pedidos y autenticación. Consume la API de `burger-house-backend`.

## 🎥 Video de Presentación

**Link del video:** _[PENDIENTE — agregar link de YouTube cuando esté subido]_

---

## 🛠️ Tecnologías

- **React 18** — Biblioteca de interfaces
- **Vite** — Build tool
- **TanStack Query** — Server state (caché, sync)
- **React Router** — Navegación SPA
- **Zustand + persist** — Carrito con localStorage
- **Axios** — Cliente HTTP con interceptor
- **Tailwind CSS** — Estilos

## 👤 Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| `admin` | `admin@burger.com` | `Admin123!` | ADMIN (acceso completo) |

> Los usuarios se crean automáticamente via seed en el backend al iniciarlo.

## 🚀 Ejecución

```bash
cd frontend-store
npm install
npm run dev
```

Disponible en: http://localhost:5173

## 📁 Páginas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Store Home | Público |
| `/catalogo` | Catálogo con filtros | Público |
| `/productos/:id` | Detalle de producto | Público |
| `/cart` | Carrito de compras | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro de usuario | Público |
| `/mis-pedidos` | Historial de pedidos | Requiere auth |
