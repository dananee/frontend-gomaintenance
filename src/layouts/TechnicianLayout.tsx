"use client";

import { Home, Wrench, Package, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TechnicianHeader } from "./TechnicianHeader";

interface TechnicianLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Home", href: "/technician", icon: Home },
  { name: "Tasks", href: "/technician/tasks", icon: Wrench },
  { name: "Parts", href: "/technician/parts", icon: Package },
  { name: "Report", href: "/technician/report", icon: AlertCircle },
];

export function TechnicianLayout({ children }: TechnicianLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <TechnicianHeader />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
