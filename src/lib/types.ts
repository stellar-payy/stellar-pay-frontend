// Shared types for the stellar-pay merchant dashboard.
// Amounts and timestamps stay as strings end to end; only src/lib/format.ts parses
// them, and only for display, never for arithmetic.
// Field names mirror the backend's JSON wire format (snake_case) directly, since
// this is a thin v0.1 read-only client with no case-mapping layer.

export type PaymentStatus = "pending" | "detected" | "confirmed" | "failed" | "expired";

export type Asset = "XLM";

export interface Payment {
  id: string;
  status: PaymentStatus;
  asset: Asset;
  amount: string;
  destination: string;
  memo: string | null;
  reference: string | null;
  stellar_tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListPaymentsResponse {
  data: Payment[];
  page: number;
  per_page: number;
  total: number;
}

export type WebhookEventStatus = "pending" | "delivered" | "failed";

export interface WebhookEvent {
  id: string;
  payment_id: string;
  status: WebhookEventStatus;
  attempt: number;
  url: string;
  response_status: number | null;
  created_at: string;
  delivered_at: string | null;
}

export interface ListWebhookEventsResponse {
  data: WebhookEvent[];
}

export interface HealthResponse {
  status: string;
}

export interface ApiError {
  message: string;
  status: number;
}
