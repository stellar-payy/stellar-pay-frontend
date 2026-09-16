import type { ReactElement } from "react";
import type { WebhookEventStatus } from "@/lib/types";
import { WEBHOOK_STATUS_COLORS } from "@/lib/constants";

interface WebhookStatusBadgeProps {
  status: WebhookEventStatus;
}

export function WebhookStatusBadge({ status }: WebhookStatusBadgeProps): ReactElement {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${WEBHOOK_STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}
