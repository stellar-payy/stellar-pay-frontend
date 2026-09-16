import type { ReactElement } from "react";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-zinc-500">
      <p>{message}</p>
    </div>
  );
}
