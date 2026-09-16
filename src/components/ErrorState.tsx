import type { ReactElement } from "react";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
      <p className="font-medium">Something went wrong</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
