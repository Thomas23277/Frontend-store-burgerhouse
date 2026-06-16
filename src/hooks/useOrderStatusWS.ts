import { useEffect, useRef, useState } from 'react';
import { wsService } from '../services/websocketService';

interface OrderStatusEvent {
  id: number;
  estado: string;
}

interface UseOrderStatusWSResult {
  /** Estado actual del pedido (se actualiza en tiempo real) */
  currentStatus: string | null;
  /** Historial de cambios de estado */
  statusHistory: OrderStatusEvent[];
  /** Conectado al WS? */
  connected: boolean;
}

/**
 * Hook especializado para seguir el estado de un pedido específico
 * en tiempo real vía WebSocket.
 *
 * Filtra mensajes de tipo "pedido_estado" que correspondan al pedido indicado.
 *
 * @example
 * ```tsx
 * const { currentStatus, connected } = useOrderStatusWS(pedidoId);
 * if (currentStatus === 'entregado') ...
 * ```
 */
export function useOrderStatusWS(pedidoId: number | null): UseOrderStatusWSResult {
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<OrderStatusEvent[]>([]);
  const [connected, setConnected] = useState(false);

  // Guardar pedidoId actual para usarlo dentro del handler
  const pedidoIdRef = useRef(pedidoId);
  pedidoIdRef.current = pedidoId;

  useEffect(() => {
    const unsubConnected = wsService.onConnectionChange(setConnected);

    const unsub = wsService.subscribe((msg: unknown) => {
      const data = msg as { type?: string; data?: unknown };

      if (data?.type === 'pedido_estado') {
        const payload = data.data as OrderStatusEvent | undefined;
        if (payload && payload.id === pedidoIdRef.current) {
          setCurrentStatus(payload.estado);
          setStatusHistory((prev) => {
            // Evitar duplicados consecutivos
            if (prev.length > 0 && prev[prev.length - 1].estado === payload.estado) {
              return prev;
            }
            return [...prev, payload];
          });
        }
      }
    });

    return () => {
      unsub();
      unsubConnected();
    };
  }, []);

  // Resetear estado si cambia el pedidoId
  useEffect(() => {
    setCurrentStatus(null);
    setStatusHistory([]);
  }, [pedidoId]);

  return { currentStatus, statusHistory, connected };
}
