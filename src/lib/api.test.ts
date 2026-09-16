import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError, getHealth, getPayment, getPaymentWebhookEvents, listPayments } from "./api";
import type { Payment } from "./types";

const samplePayment: Payment = {
  id: "11111111-1111-1111-1111-111111111111",
  status: "pending",
  asset: "XLM",
  amount: "10.0000000",
  destination: "GABCDEXAMPLE",
  memo: "abc123",
  reference: "order-1",
  stellar_tx_hash: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("api client", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getHealth returns the parsed health response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ status: "ok" }));
    const result = await getHealth();
    expect(result).toEqual({ status: "ok" });
  });

  it("listPayments builds query params and returns the parsed list", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ data: [samplePayment], page: 1, per_page: 20, total: 1 }));
    const result = await listPayments({ status: "pending", page: 1, perPage: 20 });
    expect(result.data).toHaveLength(1);

    const calledUrl = vi.mocked(fetch).mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("status=pending");
    expect(calledUrl).toContain("page=1");
    expect(calledUrl).toContain("per_page=20");
  });

  it("getPayment returns a single payment", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(samplePayment));
    const result = await getPayment(samplePayment.id);
    expect(result.id).toBe(samplePayment.id);
  });

  it("getPaymentWebhookEvents returns the parsed list", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ data: [] }));
    const result = await getPaymentWebhookEvents(samplePayment.id);
    expect(result.data).toEqual([]);
  });

  it("throws a typed ApiRequestError on a non-2xx response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ error: "not found" }, 404));
    await expect(getPayment("missing")).rejects.toBeInstanceOf(ApiRequestError);
  });

  it("throws when the response shape does not match the expected type", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ unexpected: true }));
    await expect(getPayment(samplePayment.id)).rejects.toBeInstanceOf(ApiRequestError);
  });
});
