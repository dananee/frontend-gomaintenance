"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWorkOrdersBoardStore } from "../store/useWorkOrdersBoardStore";
import { WorkOrderBoardUpdateEvent } from "../types/workOrder.types";

export function useWorkOrderBoardStream(boardId: string) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const applyServerEvent = useWorkOrdersBoardStore((state) => state.applyServerEvent);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const apiHost = apiUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    let closedByUser = false;

    const connect = () => {
      const wsUrl = `${protocol}//${apiHost}/api/v1/boards/${encodeURIComponent(
        boardId
      )}/stream?token=${encodeURIComponent(token)}`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data: WorkOrderBoardUpdateEvent = JSON.parse(event.data);
          if (data.type === "work_order.updated") {
            applyServerEvent(data);
          }
        } catch {
        }
      };

      ws.onclose = () => {
        if (closedByUser) {
          return;
        }
        if (reconnectAttempts >= 5) {
          return;
        }
        reconnectAttempts += 1;
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttempts - 1),
          30000
        );
        setTimeout(connect, delay);
      };

      ws.onerror = () => {
      };
    };

    connect();

    return () => {
      closedByUser = true;
      if (ws) {
        ws.close();
      }
    };
  }, [boardId, isAuthenticated, token, applyServerEvent]);
}

