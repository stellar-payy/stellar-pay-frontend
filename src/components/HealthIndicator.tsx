"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { getHealth } from "@/lib/api";

const POLL_INTERVAL_MS = 15000;

type HealthState = "checking" | "up" | "down";

export function HealthIndicator(): ReactElement {
  const [health, setHealth] = useState<HealthState>("checking");

  useEffect((): (() => void) => {
    let cancelled = false;

    async function check(): Promise<void> {
      try {
        await getHealth();
        if (!cancelled) {
          setHealth("up");
        }
      } catch {
        if (!cancelled) {
          setHealth("down");
        }
      }
    }

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);

    return (): void => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const colorClass = health === "up" ? "bg-emerald-500" : health === "down" ? "bg-red-500" : "bg-zinc-300";
  const label = health === "up" ? "API online" : health === "down" ? "API offline" : "Checking...";

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500">
      <span className={`h-2 w-2 rounded-full ${colorClass}`} />
      {label}
    </div>
  );
}
