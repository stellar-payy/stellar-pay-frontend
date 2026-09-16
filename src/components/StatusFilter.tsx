"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, ReactElement } from "react";
import type { PaymentStatus } from "@/lib/types";

const STATUS_OPTIONS: readonly PaymentStatus[] = ["pending", "detected", "confirmed", "failed", "expired"];

export function StatusFilter(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "";

  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value) {
      params.set("status", event.target.value);
    } else {
      params.delete("status");
    }
    // filter changes reset pagination, since the previous page may not exist for the new filter
    params.delete("page");
    router.push(`/?${params.toString()}`);
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
    >
      <option value="">All statuses</option>
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
