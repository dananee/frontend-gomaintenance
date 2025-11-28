"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [value, setValue] = useState("");

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search vehicles, work orders, parts..."
        className="w-full rounded-full pl-10"
      />
      {value && (
        <div className="absolute left-0 right-0 top-11 rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Quick search</p>
          <p className="text-gray-900 dark:text-gray-100">No live backend hooked up yet.</p>
        </div>
      )}
    </div>
  );
}
