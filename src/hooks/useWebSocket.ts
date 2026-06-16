import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { wsService } from '../services/websocketService';
import { useWsStore } from '../store/wsStore';

type MessageHandler = (data: unknown) => void;

interface UseWebSocketOptions {
  onMessage?: MessageHandler;
  onStatusChange?: (connected: boolean) => void;
  /** Si es false, no conecta automáticamente. Default: true */
  autoConnect?: boolean;
}

/**
 * Hook WebSocket — wrapper alrededor del singleton wsService.
 *
 * El hook solo conecta/desconecta según sesión y registra handlers.
 * La conexión real la maneja wsService (una sola instancia global).
 * StrictMode no afecta porque el singleton persiste fuera de React.
 */
export function useWebSocket({
  onMessage,
  onStatusChange,
  autoConnect = true,
}: UseWebSocketOptions = {}) {
  const { user, isAuthenticated } = useAuth();
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  // Siempre tener el handler actual vía ref para no reconectar en cada render
  useEffect(() => {
    if (!onMessage) return;
    const wrapper = (data: unknown) => onMessageRef.current?.(data);
    const unsub = wsService.subscribe(wrapper);
    return unsub;
  }, []); // solo se subscribe/desuscribe al montar/desmontar

  // Notificar cambios de estado si el componente lo requiere
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;
  useEffect(() => {
    if (!onStatusChange) return;
    const unsub = useWsStore.subscribe(
      (s) => s.connected,
      (connected) => onStatusChangeRef.current?.(connected),
    );
    return unsub;
  }, []); // solo al montar/desmontar

  // Conectar/desconectar según sesión
  useEffect(() => {
    if (!autoConnect) return;

    if (isAuthenticated && user) {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];

      if (token) {
        // El singleton ya tiene guardado si está conectado o conectando,
        // así que esto es seguro incluso en StrictMode
        wsService.connect(token);
      }
    } else {
      wsService.disconnect();
    }

    // NO cerramos conexión al desmontar —
    // el singleton mantiene la conexión viva entre componentes/páginas.
    // StrictMode duplica efectos pero el singleton solo crea UNA conexión.
  }, [isAuthenticated, user, autoConnect]);

  const send = useCallback((data: unknown) => wsService.send(data), []);
  const disconnect = useCallback(() => wsService.disconnect(), []);

  return { send, disconnect };
}
