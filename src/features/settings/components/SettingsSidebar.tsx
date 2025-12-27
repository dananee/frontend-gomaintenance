"use client";

import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/routing"; // Use shared routing
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { apiClient } from "@/lib/api/axiosClient";
import { toast } from "sonner";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Building,
  Palette,
  Shield,
  Bell,
  Link as LinkIcon,
  Warehouse as WarehouseIcon
} from "lucide-react";

export function SettingsSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("settings.navigation");

  const settingsNavItems = [
    {
      title: t("profile"),
      href: "/dashboard/settings/profile",
      icon: User,
    },
    {
      title: t("company"),
      href: "/dashboard/settings/company",
      icon: Building,
    },
    {
      title: t("branding"),
      href: "/dashboard/settings/branding",
      icon: Palette,
    },
    {
      title: t("roles"),
      href: "/dashboard/settings/roles",
      icon: Shield,
    },
    {
      title: t("notifications"),
      href: "/dashboard/settings/notifications",
      icon: Bell,
    },
    {
      title: t("inventory"),
      href: "/dashboard/settings/inventory/warehouses",
      icon: WarehouseIcon,
    },
    {
      title: t("integrations"),
      href: "/dashboard/settings/integrations",
      icon: LinkIcon,
    },
  ];

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

      <div className="mt-auto border-t pt-4">
        <div className="px-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Language
          </p>
          <Select
            value={locale}
            onValueChange={async (val) => {
              setIsPending(true);
              try {
                await apiClient.put("/settings/language", { language: val });
                router.replace(pathname, { locale: val });
                router.refresh();
                toast.success("Language updated");
              } catch (error) {
                console.error(error);
                toast.error("Failed to update language");
              } finally {
                setIsPending(false);
              }
            }}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
}
