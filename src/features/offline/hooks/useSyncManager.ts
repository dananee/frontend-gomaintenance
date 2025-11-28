"use client";

import { useEffect } from "react";
import { getSyncQueue, clearSyncQueue } from "../lib/storage";
import { toast } from "sonner";

export function useSyncManager() {
  useEffect(() => {
    const handleOnline = async () => {
      const queue = await getSyncQueue();
      if (queue.length === 0) return;

      toast.info(`Syncing ${queue.length} offline actions...`);

      try {
        // Process queue sequentially
        for (const item of queue) {
          try {
            await fetch(item.url, {
              method: item.method,
              body: JSON.stringify(item.body),
              headers: { "Content-Type": "application/json" },
            });
          } catch (error) {
            console.error("Failed to sync item:", item, error);
          }
        }

        await clearSyncQueue();
        toast.success("Sync completed successfully");
      } catch (error) {
        console.error("Sync failed:", error);
        toast.error("Sync failed. Will retry later.");
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);
}
