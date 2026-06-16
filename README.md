# 🏪 Burger House — Frontend Store

Frontend público de **Burger House** para clientes. Catálogo con filtros, carrito con persistencia, pedidos con seguimiento en tiempo real, pagos con MercadoPago y panel de estadísticas para administradores.

## 🎥 Video de Presentación

**Link del video:** _[PENDIENTE — agregar link de YouTube cuando esté subido]_

---

## 🛠️ Tecnologías

- **React 18** — Biblioteca de interfaces
- **Vite 8** — Build tool (Rolldown)
- **TanStack Query** — Server state (caché, sync)
- **React Router** — Navegación SPA
- **Zustand + persist** — Carrito con localStorage + WebSocket store
- **Axios** — Cliente HTTP con interceptor
- **Tailwind CSS** — Estilos
- **Recharts** — Gráficos de estadísticas

## 🚀 Ejecución

### Requisitos

- Node.js 20+
- npm 10+

### Instalación

```bash
cd Frontend-store-burgerhouse
npm install

# Copiar y revisar variables de entorno (opcional, defaults funcionan con proxy)
copy .env.example .env
```

### Ejecutar desarrollo (con proxy al backend)

```bash
# Backend debe estar corriendo en http://localhost:8000
npm run dev
```

### Build producción

```bash
npm run build
```

Disponible en: http://localhost:5173

## 📁 Páginas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Store Home | Público |
| `/catalogo` | Catálogo con filtros por categoría | Público |
| `/productos/:id` | Detalle de producto + agregar al carrito | Público |
| `/cart` | Carrito de compras | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro de usuario | Público |
| `/mis-pedidos` | Historial de pedidos + WebSocket en tiempo real | Requiere auth |
| `/pago/exito` | Retorno post-pago exitoso (MercadoPago) | Público |
| `/pago/fallo` | Retorno post-pago fallido (MercadoPago) | Público |
| `/admin/estadisticas` | Dashboard analítico con gráficos | ADMIN |

## 🌐 WebSocket

El frontend se conecta automáticamente al WebSocket del backend cuando hay sesión activa.

**Eventos:**
- `pedido_estado` — Notificación cuando cambia el estado de un pedido (actualiza automáticamente MisPedidos)

**Almacenamiento:**
- `useWsStore` (Zustand) — Estado de conexión, último mensaje, historial de mensajes

## 🔌 Integraciones

- **MercadoPago:** Checkout vía redirección a MP, retorno a páginas de éxito/fallo
- **WebSocket:** Notificaciones push de cambios de estado en pedidos
- **Cloudinary:** Imágenes de productos servidas desde CDN
- **Proxy Vite:** `/api` → backend, `/ws` → WebSocket backend

## 👤 Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| `admin` | `admin@burger.com` | `Admin123!` | ADMIN |
| _(registro)_ | _cualquier email_ | _min 6 caracteres_ | CLIENT |

> Los usuarios se crean automáticamente via seed en el backend al iniciarlo.

## 🌐 Variables de Entorno

Ver `.env.example` — ambas son opcionales (defaults funcionan con proxy):

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `/api/v1` | URL base de la API |
| `VITE_WS_URL` | `ws://localhost/ws` | URL del WebSocket |
