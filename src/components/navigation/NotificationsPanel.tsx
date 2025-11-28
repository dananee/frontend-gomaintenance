"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/features/notifications/types/notification.types";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import Link from "next/link";

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
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(mockNotifications);

  const unreadCount = items.filter((item) => !item.isRead).length;

  const markAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleRead = (id: string) => {
    setItems((prev) => prev.map((item) => 
      item.id === id ? { ...item, isRead: true } : item
    ));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
              <Button variant="ghost" size="sm" onClick={markAll} className="text-xs h-auto py-1">
                Mark all read
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <NotificationItem 
                      notification={item} 
                      onRead={handleRead}
                      onClick={() => setIsOpen(false)}
                    />
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No notifications
                </div>
              )}
            </div>

            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
              <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-xs justify-center">
                  View all notifications
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
