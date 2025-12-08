"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { mockNotifications } from "@/features/notifications/data/mockNotifications";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { Notification } from "@/features/notifications/types/notification.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Filter, Search } from "lucide-react";

interface AllNotificationsPageProps {
  params: {
    locale: string;
  };
}

export default function AllNotificationsPage({ params }: AllNotificationsPageProps) {
  const { locale } = params;
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesType = typeFilter === "all" || n.category === typeFilter;
      const matchesSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [notifications, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Full history with filters, pagination, and bulk controls.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead}>
          <CheckCircle className="mr-2 h-4 w-4" /> Mark everything read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or message"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="work_order">Work Orders</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notification stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pageData.map((notification) => (
              <div key={notification.id} className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <NotificationItem notification={notification} onRead={() => undefined} />
              </div>
            ))}
            {pageData.length === 0 && (
              <p className="py-6 text-center text-gray-500">No notifications match your filters.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Unread</span>
              <Badge variant="outline">{notifications.filter((n) => !n.isRead).length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <Badge variant="outline">{notifications.length}</Badge>
            </div>
            <Link href={`/${locale}/dashboard`}>
              <Button variant="link" className="px-0">Back to dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={pageSize}
          totalItems={filtered.length}
        />
      </div>
    </div>
  );
}