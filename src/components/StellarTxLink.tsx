import type { ReactElement } from "react";
import { buildStellarTxUrl } from "@/lib/format";

interface StellarTxLinkProps {
  txHash: string | null;
}

export function StellarTxLink({ txHash }: StellarTxLinkProps): ReactElement {
  if (!txHash) {
    return <span className="text-zinc-400">Pending</span>;
  }

  return (
    <a
      href={buildStellarTxUrl(txHash)}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-sky-700 underline hover:text-sky-900"
    >
      {txHash.slice(0, 8)}...{txHash.slice(-6)}
    </a>
  );
}
