"use client";

import { useState } from "react";
import { Bell, CheckCircle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mockNotifications = [
  { id: "1", title: "WO-124 assigned", detail: "Brake inspection on Truck 12", read: false },
  { id: "2", title: "Low stock", detail: "Oil filter below threshold", read: false },
  { id: "3", title: "Vehicle updated", detail: "Odometer synced from telematics", read: true },
];

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(mockNotifications);

  const unreadCount = items.filter((item) => !item.read).length;

  const markAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
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
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
            <Button variant="ghost" size="sm" onClick={markAll} className="text-xs">
              Mark all read
            </Button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto px-4 pb-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm shadow-sm dark:border-gray-700",
                  item.read ? "bg-gray-50 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                  {item.read ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <CircleDot className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
