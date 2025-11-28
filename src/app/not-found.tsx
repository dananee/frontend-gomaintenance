"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/40">
          <Compass className="h-10 w-10 text-blue-600 dark:text-blue-300" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Error 404</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Page not found</h1>
          <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-300">
            The page you are looking for might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/work-orders">View work orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
