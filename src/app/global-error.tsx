"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

// Global error boundary for the root layout (outside locale context)
// Cannot use translations here as it might be rendered before provider is established
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Something went wrong!
            </h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              An unexpected error occurred.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                Reload Page
              </Button>
              <Button onClick={() => reset()}>Try again</Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
