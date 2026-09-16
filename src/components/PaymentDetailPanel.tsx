import type { ReactElement } from "react";
import type { Payment } from "@/lib/types";
import { formatAmount, formatDate } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { StatusTimeline } from "./StatusTimeline";
import { CopyableAddress } from "./CopyableAddress";
import { StellarTxLink } from "./StellarTxLink";

interface PaymentDetailPanelProps {
  payment: Payment;
}

export function PaymentDetailPanel({ payment }: PaymentDetailPanelProps): ReactElement {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-zinc-200 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Payment {payment.reference ?? payment.id}</h1>
        <StatusBadge status={payment.status} />
      </div>
      <StatusTimeline status={payment.status} />
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-zinc-500">Amount</dt>
          <dd className="text-sm font-medium">{formatAmount(payment.amount, payment.asset)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-zinc-500">Destination</dt>
          <dd>
            <CopyableAddress address={payment.destination} />
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-zinc-500">Memo</dt>
          <dd className="font-mono text-sm">{payment.memo ?? "-"}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-zinc-500">Stellar transaction</dt>
          <dd>
            <StellarTxLink txHash={payment.stellar_tx_hash} />
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-zinc-500">Created</dt>
          <dd className="text-sm">{formatDate(payment.created_at)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-zinc-500">Updated</dt>
          <dd className="text-sm">{formatDate(payment.updated_at)}</dd>
        </div>
      </dl>
    </div>
  );
}
