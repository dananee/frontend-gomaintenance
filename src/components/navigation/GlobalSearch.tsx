"use client";

import { GlobalSearch as GlobalSearchCommand } from "../GlobalSearch";

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  return <GlobalSearchCommand className={className} />;
}
