import { describe, expect, it } from "vitest";
import { buildStellarTxUrl, formatAmount, formatDate } from "./format";

describe("formatAmount", () => {
  it("appends the asset symbol to a whole number amount", () => {
    expect(formatAmount("10", "XLM")).toBe("10 XLM");
  });

  it("trims trailing zeros while preserving up to 7 fractional digits", () => {
    expect(formatAmount("10.5000000", "XLM")).toBe("10.5 XLM");
  });

  it("falls back to the raw string when the amount cannot be parsed", () => {
    expect(formatAmount("not-a-number", "XLM")).toBe("not-a-number XLM");
  });
});

describe("formatDate", () => {
  it("formats a valid ISO timestamp into a non-empty display string", () => {
    const result = formatDate("2026-01-01T12:00:00Z");
    expect(result).not.toBe("2026-01-01T12:00:00Z");
    expect(result.length).toBeGreaterThan(0);
  });

  it("falls back to the raw string when the timestamp is invalid", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("buildStellarTxUrl", () => {
  it("builds a stellar.expert testnet explorer URL for a tx hash", () => {
    expect(buildStellarTxUrl("abc123")).toBe("https://stellar.expert/explorer/testnet/tx/abc123");
  });
});
