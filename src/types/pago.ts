export interface CreatePreferenceResponse {
  mp_preference_id: string;
  init_point: string;
  idempotency_key: string;
}

export interface PagoResponse {
  id: number;
  pedido_id: number;
  mp_payment_id: string | null;
  mp_status: string;
  mp_status_detail: string | null;
  transaction_amount: number;
  currency_id: string;
  payment_method: string;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
}
