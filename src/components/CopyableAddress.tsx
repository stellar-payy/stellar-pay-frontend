"use client";

import { useState } from "react";
import type { ReactElement } from "react";

interface CopyableAddressProps {
  address: string;
}

export function CopyableAddress({ address }: CopyableAddressProps): ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout((): void => setCopied(false), 2000);
    } catch {
      // clipboard access can be denied by the browser; the label just won't flip
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded border border-zinc-300 px-2 py-1 font-mono text-xs text-zinc-700 hover:bg-zinc-50"
    >
      <span className="max-w-[12rem] truncate">{address}</span>
      <span className="text-zinc-400">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
