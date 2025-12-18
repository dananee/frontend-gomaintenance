"use client";

import { Link, usePathname } from "@/i18n/routing";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const routeLabels: Record<string, string> = {
  dashboard: "dashboard",
  vehicles: "vehicles",
  "work-orders": "workOrders",
  maintenance: "maintenance",
  inventory: "inventory",
  settings: "settings",
  users: "users",
  reports: "reports",
  profile: "profile",
  branding: "branding", // Add to en.json if missing but fallback works
  company: "company",
  integrations: "integrations",
  notifications: "notifications",
  roles: "roles",
  parts: "parts",
  suppliers: "suppliers",
  documents: "documents"
};

export function Breadcrumbs() {
  const t = useTranslations("navigation.sidebar");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    if (pathname === "/dashboard") return [];

    const segments = pathname.split("/").filter(Boolean);
    // segments: ['dashboard', 'vehicles', '123']

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      // Determine label
      let label = segment;
      const isLast = index === segments.length - 1;

      // Heuristic for IDs: UUIDs or long alphanumeric strings, or purely numeric long IDs
      // Standard UUID is 36 chars.
      // Database IDs might be integers or shorter strings.
      // We assume if it's not a known static route segment, and it's not "edit" or "create", it's likely an ID.
      const isKnownRoute = !!routeLabels[segment] || segment === "edit" || segment === "create";

      if (segment === "dashboard") {
        label = "Home";
      } else if (routeLabels[segment]) {
        // Try to translate
        try {
          label = t(routeLabels[segment]);
        } catch {
          label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }
      } else if (segment === "edit") {
        label = tCommon("edit");
      } else if (!isKnownRoute) {
        // Likely an ID
        label = tCommon("details");
      } else {
        // Fallback
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      }

      return {
        label,
        href,
        isId: !isKnownRoute && segment !== "dashboard",
        isLast
      };
    });
  }, [pathname, t, tCommon]);

  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
      {crumbs.map((crumb, index) => {
        // Skip rendering "Home" text if it's the dashboard segment, just show icon?
        // Use existing design: Home icon + text "Home" for dashboard.
        // If segment is dashboard, we render the Home link.

        if (crumb.label === "Home") {
          return (
            <div key={crumb.href} className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          );
        }

        return (
          <div key={crumb.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 shrink-0" />
            {crumb.isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]" title={crumb.label}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white truncate max-w-[150px]"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
