import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-500">Loading payments...</div>
  );
}
