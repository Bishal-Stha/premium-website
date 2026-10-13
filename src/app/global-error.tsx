"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <h1 className="text-3xl font-light mb-4">Application Error</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-8">
          A critical system error occurred. Please refresh or return to the main portal.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-zinc-200"
          >
            Retry
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white/10"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  );
}
