"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

export function useSocket(namespace: string = "") {
  const [connected, setConnected] = useState(false);
  const { token } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        // Do not call setConnected(false) here if it triggers cascading renders
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "http://localhost:3001";
    const urlWithNamespace = namespace ? `${apiUrl}${namespace}` : apiUrl;
    const newSocket = io(urlWithNamespace, {
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const emit = useCallback((event: string, data: unknown) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: unknown) => void) => {
    const s = socketRef.current;
    if (s) {
      s.on(event, callback);
      return () => {
        s.off(event, callback);
      };
    }
    return () => {};
  }, []);

  return { connected, emit, on };
}
