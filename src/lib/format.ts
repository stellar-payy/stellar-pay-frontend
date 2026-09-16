import type { Asset } from "./types";
import { STELLAR_EXPLORER_TX_BASE_URL } from "./constants";

// amount is a decimal string with up to 7 fractional digits (Stellar's stroop
// precision). Parsing to a number here is safe because this is display-only
// formatting, never arithmetic or comparison.
export function formatAmount(amount: string, asset: Asset): string {
  const parsed = Number.parseFloat(amount);
  if (Number.isNaN(parsed)) {
    return `${amount} ${asset}`;
  }
  const formatted = parsed.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 7,
  });
  return `${formatted} ${asset}`;
}

export function formatDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function buildStellarTxUrl(txHash: string): string {
  return `${STELLAR_EXPLORER_TX_BASE_URL}/${txHash}`;
}
