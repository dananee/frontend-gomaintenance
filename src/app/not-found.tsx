"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Suspense>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-lg text-muted-foreground">Page not found</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
          <Link
            href="/dashboard/work-orders"
            className={cn(buttonVariants({ variant: "primary" }))}
          >
            View work orders
          </Link>
        </div>
      </div>
    </Suspense>
  );
}
