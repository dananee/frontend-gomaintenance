"use client";

import { Notification } from "../types/notification.types";
import { cn, formatDate } from "@/lib/utils";
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  Wrench, 
  Package, 
  Settings 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export function NotificationItem({ notification, onRead, onClick }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = () => {
    switch (notification.category) {
      case "work_order":
        return <Wrench className="h-3 w-3" />;
      case "inventory":
        return <Package className="h-3 w-3" />;
      case "system":
        return <Settings className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "relative flex cursor-pointer gap-4 rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
        !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
      )}
      onClick={() => {
        onRead?.(notification.id);
        onClick?.(notification);
      }}
    >
      <div className="mt-1 shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("text-sm font-medium", !notification.isRead ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300")}>
            {notification.title}
          </p>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {notification.message}
        </p>
        
        {notification.category && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            {getCategoryIcon()}
            <span className="capitalize">{notification.category.replace("_", " ")}</span>
          </div>
        )}
      </div>
      {!notification.isRead && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  );
}
