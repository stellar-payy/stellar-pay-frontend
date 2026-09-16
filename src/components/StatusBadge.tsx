import type { ReactElement } from "react";
import type { PaymentStatus } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/constants";

interface StatusBadgeProps {
  status: PaymentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps): ReactElement {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}
