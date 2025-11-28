"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

function formatSegment(segment: string) {
  if (!segment) return "";
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return { label: formatSegment(segment), href };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link href="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        <Home className="h-4 w-4" />
        Home
      </Link>
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {index === crumbs.length - 1 ? (
            <span className="font-semibold text-gray-900 dark:text-gray-100">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
