import type { ReactElement } from "react";
import type { PaymentStatus } from "@/lib/types";
import { PAYMENT_STATUS_ORDER } from "@/lib/constants";

interface StatusTimelineProps {
  status: PaymentStatus;
}

const TERMINAL_BAD_STATUSES: readonly PaymentStatus[] = ["failed", "expired"];

export function StatusTimeline({ status }: StatusTimelineProps): ReactElement {
  const isTerminalBad = TERMINAL_BAD_STATUSES.includes(status);
  const currentIndex = isTerminalBad ? -1 : PAYMENT_STATUS_ORDER.indexOf(status);

  return (
    <ol className="flex flex-wrap items-center gap-2">
      {PAYMENT_STATUS_ORDER.map((step, index) => {
        const isDone = !isTerminalBad && index <= currentIndex;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                isDone ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-500"
              }`}
            >
              {index + 1}
            </span>
            <span className={`text-sm capitalize ${isDone ? "text-zinc-900" : "text-zinc-400"}`}>{step}</span>
            {index < PAYMENT_STATUS_ORDER.length - 1 && <span className="h-px w-6 bg-zinc-300" />}
          </li>
        );
      })}
      {isTerminalBad && (
        <li className="flex items-center gap-2">
          <span className="h-px w-6 bg-zinc-300" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            !
          </span>
          <span className="text-sm capitalize text-red-600">{status}</span>
        </li>
      )}
    </ol>
  );
}
