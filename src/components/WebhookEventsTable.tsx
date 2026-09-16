import type { ReactElement } from "react";
import type { WebhookEvent } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { WebhookStatusBadge } from "./WebhookStatusBadge";
import { EmptyState } from "./EmptyState";

interface WebhookEventsTableProps {
  events: WebhookEvent[];
}

export function WebhookEventsTable({ events }: WebhookEventsTableProps): ReactElement {
  if (events.length === 0) {
    return <EmptyState message="No webhook delivery attempts yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Attempt</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">URL</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Status</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Response</th>
            <th className="px-4 py-2 text-left font-medium text-zinc-500">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2">{event.attempt}</td>
              <td className="max-w-[16rem] truncate px-4 py-2 font-mono text-xs">{event.url}</td>
              <td className="px-4 py-2">
                <WebhookStatusBadge status={event.status} />
              </td>
              <td className="px-4 py-2">{event.response_status ?? "-"}</td>
              <td className="px-4 py-2 text-zinc-500">{formatDate(event.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
