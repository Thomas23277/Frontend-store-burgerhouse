import apiClient from './apiClient';
import type { PagoResponse } from '../types';

export const getPagosByPedido = (pedido_id: number) =>
  apiClient.get<PagoResponse[]>(`/pagos/pedido/${pedido_id}`).then((r) => r.data);

export const getPago = (id: number) =>
  apiClient.get<PagoResponse>(`/pagos/${id}`).then((r) => r.data);
