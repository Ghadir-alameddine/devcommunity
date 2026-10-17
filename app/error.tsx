"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-6 py-16">
      <section className="w-full rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          We couldn&apos;t load this page. Please try again.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium"
          >
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}