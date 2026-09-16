import type { ReactElement } from "react";
import { listPayments } from "@/lib/api";
import type { PaymentStatus } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { PaymentsTable } from "@/components/PaymentsTable";
import { StatusFilter } from "@/components/StatusFilter";
import { PaginationControls } from "@/components/PaginationControls";

const VALID_STATUSES: readonly PaymentStatus[] = ["pending", "detected", "confirmed", "failed", "expired"];

function parseStatus(value: string | undefined): PaymentStatus | undefined {
  return VALID_STATUSES.find((status) => status === value);
}

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

interface PaymentsPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const page = parsePage(params.page);

  const response = await listPayments({ status, page, perPage: DEFAULT_PAGE_SIZE });

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payments</h1>
        <StatusFilter />
      </div>
      <PaymentsTable payments={response.data} />
      <PaginationControls page={response.page} perPage={response.per_page} total={response.total} status={status} />
    </div>
  );
}
