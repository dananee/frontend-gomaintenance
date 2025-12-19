"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/features/notifications/types/notification.types";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Low Stock Alert",
    message: "Brake Pads (BP-123) quantity is below minimum threshold.",
    type: "warning",
    category: "inventory",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    title: "Work Order Completed",
    message: "Technician John Doe completed WO-124 for Ford F-150.",
    type: "success",
    category: "work_order",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "3",
    title: "Maintenance Overdue",
    message: "Annual Inspection for Toyota Camry is overdue by 5 days.",
    type: "error",
    category: "maintenance",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function NotificationsPanel() {
  const t = useTranslations("notifications.dashboard");
  const tm = useTranslations("notifications.menu");
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = items.filter((item) => !item.isRead).length;

  const markAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label={t("title")}
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 shadow-xl border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t("title")}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAll}
            className="text-xs h-auto py-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t("actions.markAllRead")}
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <NotificationItem
                  notification={item}
                  onRead={handleRead}
                  onClick={() => setOpen(false)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500">{tm("noNotifications")}</p>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
          >
            <Button variant="ghost" className="w-full text-xs justify-center hover:bg-white dark:hover:bg-gray-800">
              {tm("viewAll")}
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
