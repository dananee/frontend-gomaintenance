"use client";

import Link from "next/link";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/useNotifications";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { CheckCheck, Filter, Search } from "lucide-react";
import { useState, useMemo } from "react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const { data } = useNotifications({ page, page_size: pageSize });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = data?.data || [];

  const handleRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const resetPage = () => setPage(1);

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === "all" ||
      (filter === "unread" && !n.isRead) ||
      n.category === filter;

    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));
  const paginatedNotifications = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your alerts and updates</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/notifications/all" className={buttonVariants({ variant: "ghost" })}>
            View all
          </Link>
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(value) => {
          setFilter(value);
          resetPage();
        }}>
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
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((notification) => (
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredNotifications.length)} of {filteredNotifications.length}
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={pageSize}
          totalItems={filteredNotifications.length}
        />
      </div>
    </div>
  );
}
