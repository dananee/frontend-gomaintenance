"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSyncManager } from "../hooks/useSyncManager";

export function OfflineIndicator() {
  useSyncManager();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
        <WifiOff className="h-4 w-4" />
        <span>You are currently offline</span>
      </div>
    </div>
  );
}
