import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { HealthIndicator } from "@/components/HealthIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellar Pay Dashboard",
  description: "Read-only merchant dashboard for stellar-pay XLM payments",
};

export default function RootLayout({ children }: LayoutProps<"/">): ReactElement {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <Link href="/" className="text-base font-semibold">
            stellar-pay
          </Link>
          <HealthIndicator />
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
