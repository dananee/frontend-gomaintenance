"use client";

import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/features/notifications/hooks/useNotifications";
import { useState } from "react";

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("notifications.dashboard");
  const tm = useTranslations("notifications.menu");
  const { data } = useNotifications({ page: 1, page_size: 10 });
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const markAsRead = useMarkNotificationAsRead();

  const items = data?.data || [];
  const unreadCount = items.filter((item) => !item.isRead).length;

  const handleMarkAll = () => {
    markAllAsRead.mutate();
  };

  const handleRead = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-full transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "focus-visible:ring-2 focus-visible:ring-blue-500",
            open && "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
          )}
          aria-label={t("title")}
        >
          <Bell className={cn("h-5 w-5 transition-colors", open ? "fill-current" : "text-gray-500 dark:text-gray-400")} />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse shadow-sm" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 shadow-xl border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t("title")}
            </p>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                {tm("new", { count: unreadCount })}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAll}
            disabled={markAllAsRead.isPending}
            className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Check className="mr-1 h-3 w-3" />
            {t("actions.markAllRead")}
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <NotificationItem
                  notification={item}
                  onRead={handleRead}
                  onClick={() => setOpen(false)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{tm("noNotifications")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tm("caughtUp")}</p>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
          >
            <Button variant="ghost" className="w-full text-xs justify-center h-8 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all">
              {tm("viewAll")}
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
