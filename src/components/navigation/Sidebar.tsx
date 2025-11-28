"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { Permission } from "@/lib/rbac/permissions";
import {
  LayoutDashboard,
  Truck,
  Wrench,
  Package,
  Users,
  BarChart3,
  X,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Vehicles",
    href: "/dashboard/vehicles",
    icon: Truck,
    permission: "view_vehicles",
  },
  {
    name: "Work Orders",
    href: "/dashboard/work-orders",
    icon: Wrench,
    permission: "view_work_orders",
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
    permission: "view_inventory",
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    permission: "view_users",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    permission: "view_reports",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isMobileOpen, closeMobile } = useSidebarStore();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Fleet Maintenance
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => closeMobile()}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
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
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeMobile}
          />

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
