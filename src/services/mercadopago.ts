import apiClient from './apiClient';
import type { CreatePreferenceResponse } from '../types';

export interface BackUrls {
  success: string;
  failure: string;
  pending: string;
}

export const createPreference = (
  pedido_id: number,
  back_urls?: BackUrls,
) =>
  apiClient
    .post<CreatePreferenceResponse>('/mercadopago/create-preference', {
      pedido_id,
      back_urls,
    })
    .then((r) => r.data);
