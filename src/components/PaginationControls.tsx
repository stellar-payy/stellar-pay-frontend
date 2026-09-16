import type { ReactElement } from "react";
import Link from "next/link";
import type { PaymentStatus } from "@/lib/types";

interface PaginationControlsProps {
  page: number;
  perPage: number;
  total: number;
  status?: PaymentStatus;
}

export function PaginationControls({ page, perPage, total, status }: PaginationControlsProps): ReactElement {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  function buildHref(targetPage: number): string {
    const params = new URLSearchParams();
    if (status) {
      params.set("status", status);
    }
    params.set("page", String(targetPage));
    return `/?${params.toString()}`;
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={isFirstPage}
        className={`rounded border px-3 py-1 ${
          isFirstPage
            ? "pointer-events-none border-zinc-200 text-zinc-300"
            : "border-zinc-300 hover:bg-zinc-50"
        }`}
      >
        Previous
      </Link>
      <span className="text-zinc-500">
        Page {page} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={isLastPage}
        className={`rounded border px-3 py-1 ${
          isLastPage ? "pointer-events-none border-zinc-200 text-zinc-300" : "border-zinc-300 hover:bg-zinc-50"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
