import type { PaymentStatus, WebhookEventStatus } from "./types";

export const DEFAULT_PAGE_SIZE = 20;

export const STELLAR_EXPLORER_TX_BASE_URL = "https://stellar.expert/explorer/testnet/tx";

// Happy-path ordering for the status timeline. "failed" and "expired" are terminal
// branches handled separately by StatusTimeline, not part of this linear sequence.
export const PAYMENT_STATUS_ORDER: readonly PaymentStatus[] = ["pending", "detected", "confirmed"];

export const STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  detected: "bg-sky-100 text-sky-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  expired: "bg-zinc-200 text-zinc-600",
};

export const WEBHOOK_STATUS_COLORS: Record<WebhookEventStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
};
