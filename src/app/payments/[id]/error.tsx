"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";
import { ErrorState } from "@/components/ErrorState";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps): ReactElement {
  useEffect((): void => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-24">
      <ErrorState message={error.message || "Failed to load payment details."} />
      <button
        type="button"
        onClick={reset}
        className="rounded border border-zinc-300 px-4 py-1.5 text-sm hover:bg-zinc-50"
      >
        Try again
      </button>
    </div>
  );
}
