import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '../hooks/useWebSocket';

/**
 * Escucha mensajes WebSocket globales e invalida queries según el tipo.
 *
 * Se monta una sola vez en App.tsx — no depende del ciclo de vida de ninguna página.
 */
export default function WsInvalidator() {
  const queryClient = useQueryClient();

  useWebSocket({
    onMessage: (data) => {
      const msg = data as { type?: string; data?: { id?: number } };
      if (!msg.type) return;

      switch (msg.type) {
        // ── Pedidos ──────────────────────────────────────
        case 'pedido_estado':
        case 'nuevo_pedido':
          queryClient.invalidateQueries({ queryKey: ['mis-pedidos'] });
          if (msg.data?.id) {
            queryClient.invalidateQueries({ queryKey: ['historial', msg.data.id] });
          }
          break;

        // ── Productos ────────────────────────────────────
        case 'producto_creado':
        case 'producto_actualizado':
        case 'producto_eliminado':
          queryClient.invalidateQueries({ queryKey: ['productos'] });
          queryClient.invalidateQueries({ queryKey: ['destacados'] });
          if (msg.data?.id) {
            queryClient.invalidateQueries({ queryKey: ['producto', msg.data.id] });
          }
          break;

        // ── Categorías ───────────────────────────────────
        case 'categoria_creada':
        case 'categoria_actualizada':
        case 'categoria_eliminada':
          queryClient.invalidateQueries({ queryKey: ['categorias'] });
          // Si se agrega/quita una categoría, los productos pueden cambiar
          queryClient.invalidateQueries({ queryKey: ['productos'] });
          break;

        default:
          break;
      }
    },
  });

  return null;
}
