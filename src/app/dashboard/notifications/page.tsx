"use client";

import { useState } from "react";
import { Notification } from "@/features/notifications/types/notification.types";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CheckCheck, Filter, Search } from "lucide-react";

// Mock Data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Low Stock Alert",
    message: "Brake Pads (BP-123) quantity is below minimum threshold.",
    type: "warning",
    category: "inventory",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "2",
    title: "Work Order Completed",
    message: "Technician John Doe completed WO-124 for Ford F-150.",
    type: "success",
    category: "work_order",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    title: "Maintenance Overdue",
    message: "Annual Inspection for Toyota Camry is overdue by 5 days.",
    type: "error",
    category: "maintenance",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "4",
    title: "System Update",
    message: "System maintenance scheduled for Saturday 2 AM.",
    type: "info",
    category: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === "all" || 
      (filter === "unread" && !n.isRead) ||
      n.category === filter;
    
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your alerts and updates</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search notifications..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="work_order">Work Orders</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <NotificationItem 
                notification={notification} 
                onRead={handleRead}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No notifications found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
