import type { ReactElement } from "react";
import Link from "next/link";

export default function NotFound(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="text-lg font-medium">Payment not found</p>
      <Link href="/" className="text-sm text-sky-700 underline">
        Back to payments
      </Link>
    </div>
  );
}
