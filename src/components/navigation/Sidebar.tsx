"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { Permission } from "@/lib/rbac/permissions";
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  Package,
  Users,
  BarChart3,
  X,
  Wrench,
} from "lucide-react";

import { useTranslations } from "next-intl";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
}

export function Sidebar() {
  const t = useTranslations("navigation.sidebar");
  const pathname = usePathname();
  const { isOpen, isMobileOpen, closeMobile } = useSidebarStore();

  const navItems: NavItem[] = [
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("vehicles"),
      href: "/dashboard/vehicles",
      icon: Car,
      permission: "view_vehicles",
    },
    {
      name: t("workOrders"),
      href: "/dashboard/work-orders",
      icon: ClipboardList,
      permission: "view_work_orders",
    },
    {
      name: t("maintenance"),
      href: "/dashboard/maintenance",
      icon: Wrench,
      permission: "view_maintenance",
    },
    {
      name: t("inventory"),
      href: "/dashboard/inventory",
      icon: Package,
      permission: "view_inventory",
    },
    {
      name: t("users"),
      href: "/dashboard/users",
      icon: Users,
      permission: "view_users",
    },
    {
      name: t("reports"),
      href: "/dashboard/reports",
      icon: BarChart3,
      permission: "view_reports",
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => closeMobile()}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-700 hover:bg-gray-100 hover:shadow-md dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute -left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 shadow-lg shadow-blue-500/50" />
              )}

              {/* Icon with background */}
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-white/20 shadow-inner"
                    : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  )}
                />
              </div>

              <span className="font-semibold">{item.name}</span>

              {/* Hover indicator */}
              {!isActive && (
                <div className="absolute right-3 h-2 w-2 rounded-full bg-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden h-screen border-r border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-900 lg:block",
          isOpen ? "w-64" : "w-0"
        )}
      >
        {isOpen && sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeMobile} />

          {/* Sidebar */}
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            {/* Close button */}
            <button
              onClick={closeMobile}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>

            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
