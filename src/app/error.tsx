"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error on server/telemetry without leaking to visitor UI
    console.error("Client Error Boundary caught error:", error.digest || error.message);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mb-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">
        Error Encountered
      </span>
      <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
        Something went <span className="font-serif italic text-red-400">wrong</span>
      </h1>
      <p className="text-zinc-400 max-w-md text-sm mb-8">
        We encountered an unexpected issue while loading this page. Our expedition desk has been notified.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white text-black font-semibold uppercase tracking-wider text-xs rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-white/20 text-white font-semibold uppercase tracking-wider text-xs rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
