import type {
  ApiError,
  Asset,
  HealthResponse,
  ListPaymentsResponse,
  ListWebhookEventsResponse,
  Payment,
  PaymentStatus,
  WebhookEvent,
  WebhookEventStatus,
} from "./types";

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = "ApiRequestError";
    this.status = apiError.status;
  }
}

// Single seam for auth headers. A future API key or session token is added
// here only, without touching every call site.
function buildHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

// === JSON parse boundary: unknown + type guards, never `any`

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    value === "pending" ||
    value === "detected" ||
    value === "confirmed" ||
    value === "failed" ||
    value === "expired"
  );
}

function isAsset(value: unknown): value is Asset {
  return value === "XLM";
}

function isWebhookEventStatus(value: unknown): value is WebhookEventStatus {
  return value === "pending" || value === "delivered" || value === "failed";
}

function isPayment(value: unknown): value is Payment {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === "string" &&
    isPaymentStatus(value.status) &&
    isAsset(value.asset) &&
    typeof value.amount === "string" &&
    typeof value.destination === "string" &&
    (value.memo === null || typeof value.memo === "string") &&
    (value.reference === null || typeof value.reference === "string") &&
    (value.stellar_tx_hash === null || typeof value.stellar_tx_hash === "string") &&
    typeof value.created_at === "string" &&
    typeof value.updated_at === "string"
  );
}

function isListPaymentsResponse(value: unknown): value is ListPaymentsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    value.data.every(isPayment) &&
    typeof value.page === "number" &&
    typeof value.per_page === "number" &&
    typeof value.total === "number"
  );
}

function isWebhookEvent(value: unknown): value is WebhookEvent {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === "string" &&
    typeof value.payment_id === "string" &&
    isWebhookEventStatus(value.status) &&
    typeof value.attempt === "number" &&
    typeof value.url === "string" &&
    (value.response_status === null || typeof value.response_status === "number") &&
    typeof value.created_at === "string" &&
    (value.delivered_at === null || typeof value.delivered_at === "string")
  );
}

function isListWebhookEventsResponse(value: unknown): value is ListWebhookEventsResponse {
  return isRecord(value) && Array.isArray(value.data) && value.data.every(isWebhookEvent);
}

function isHealthResponse(value: unknown): value is HealthResponse {
  return isRecord(value) && typeof value.status === "string";
}

// === Request plumbing

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (isRecord(body) && typeof body.error === "string") {
      return body.error;
    }
  } catch {
    // body was not JSON; fall back to the status text below
  }
  return response.statusText || `Request failed with status ${response.status}`;
}

async function requestJson<T>(
  path: string,
  validate: (value: unknown) => value is T,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...buildHeaders(), ...init?.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiRequestError({ message, status: response.status });
  }

  const data: unknown = await response.json();
  if (!validate(data)) {
    throw new ApiRequestError({ message: "Unexpected response shape from API", status: response.status });
  }

  return data;
}

// === Public API client

export async function getHealth(): Promise<HealthResponse> {
  return requestJson("/health", isHealthResponse);
}

export interface ListPaymentsParams {
  status?: PaymentStatus;
  page?: number;
  perPage?: number;
}

export async function listPayments(params: ListPaymentsParams = {}): Promise<ListPaymentsResponse> {
  const query = new URLSearchParams();
  if (params.status) {
    query.set("status", params.status);
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.perPage) {
    query.set("per_page", String(params.perPage));
  }
  const queryString = query.toString();
  return requestJson(`/v1/payments${queryString ? `?${queryString}` : ""}`, isListPaymentsResponse);
}

export async function getPayment(id: string): Promise<Payment> {
  return requestJson(`/v1/payments/${id}`, isPayment);
}

export async function getPaymentWebhookEvents(id: string): Promise<ListWebhookEventsResponse> {
  return requestJson(`/v1/payments/${id}/webhook-events`, isListWebhookEventsResponse);
}
