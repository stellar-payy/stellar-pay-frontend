import type { ReactElement } from "react";
import Link from "next/link";
import type { Payment } from "@/lib/types";
import { formatAmount, formatDate } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";

interface PaymentsTableProps {
  payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps): ReactElement {
  if (payments.length === 0) {
    return <EmptyState message="No payments match this filter." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Reference</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Amount</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Status</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2">
                <Link href={`/payments/${payment.id}`} className="font-mono text-xs text-sky-700 underline">
                  {payment.reference ?? payment.id.slice(0, 8)}
                </Link>
              </td>
              <td className="px-4 py-2">{formatAmount(payment.amount, payment.asset)}</td>
              <td className="px-4 py-2">
                <StatusBadge status={payment.status} />
              </td>
              <td className="px-4 py-2 text-zinc-500">{formatDate(payment.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
