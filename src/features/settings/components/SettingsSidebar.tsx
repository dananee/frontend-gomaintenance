"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Building,
  Palette,
  Shield,
  Bell,
  Link as LinkIcon,
} from "lucide-react";

interface SettingsSidebarProps {
  locale: string;
}

const getSettingsNavItems = (locale: string) => [
  {
    title: "Profile",
    href: `/${locale}/dashboard/settings/profile`,
    icon: User,
  },
  {
    title: "Company",
    href: `/${locale}/dashboard/settings/company`,
    icon: Building,
  },
  {
    title: "Branding",
    href: `/${locale}/dashboard/settings/branding`,
    icon: Palette,
  },
  {
    title: "Roles & Permissions",
    href: `/${locale}/dashboard/settings/roles`,
    icon: Shield,
  },
  {
    title: "Notifications",
    href: `/${locale}/dashboard/settings/notifications`,
    icon: Bell,
  },
  {
    title: "Integrations",
    href: `/${locale}/dashboard/settings/integrations`,
    icon: LinkIcon,
  },
];

export function SettingsSidebar({
  locale = "en",
}: Partial<SettingsSidebarProps>) {
  const pathname = usePathname();
  const settingsNavItems = getSettingsNavItems(locale);

  return (
    <nav className="flex flex-col space-y-1 w-64 shrink-0">
      {settingsNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-300"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
