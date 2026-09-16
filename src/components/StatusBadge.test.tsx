import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";
import type { PaymentStatus } from "@/lib/types";

const STATUSES: readonly PaymentStatus[] = ["pending", "detected", "confirmed", "failed", "expired"];

describe("StatusBadge", () => {
  it.each(STATUSES)("renders the %s status label", (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(status).textContent).toBe(status);
  });
});
