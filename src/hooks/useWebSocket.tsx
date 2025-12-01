"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface WebSocketContextValue {
  status: ConnectionStatus;
  send: (message: any) => void;
  lastMessage: MessageEvent | null;
  subscribe: (callback: (event: MessageEvent) => void) => () => void;
}

const defaultContext: WebSocketContextValue = {
  status: "disconnected",
  send: () => {},
  lastMessage: null,
  subscribe: () => () => {},
};

const WebSocketContext = createContext<WebSocketContextValue>(defaultContext);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const subscribersRef = useRef<Set<(event: MessageEvent) => void>>(new Set());
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const connect = useCallback(() => {
    if (!isAuthenticated || !token) {
      setStatus("disconnected");
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    setStatus("connecting");

    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_BASE_URL || "localhost:8080"}/api/v1/notifications/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setStatus("connected");
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      setLastMessage(event);
      // Notify all subscribers
      subscribersRef.current.forEach((callback) => callback(event));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("error");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setStatus("disconnected");
      wsRef.current = null;

      // Attempt to reconnect with exponential backoff
      if (isAuthenticated && reconnectAttempts.current < 10) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }, []);

  const subscribe = useCallback((callback: (event: MessageEvent) => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ status, send, lastMessage, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  return context;
}
