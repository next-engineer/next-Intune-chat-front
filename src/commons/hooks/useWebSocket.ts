import { useEffect, useRef } from "react";
import websocketService from "../apis/websocket.api";
import { useUserStatusStore } from "../../stores/userStatusStore";

/**
 * WebSocket 연결을 관리하는 React 훅
 * 컴포넌트에서 쉽게 WebSocket 연결을 사용할 수 있도록 래핑합니다.
 */
export const useWebSocket = (userId: string, username: string) => {
  const { setUsers } = useUserStatusStore();
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current) {
      websocketService.connect(userId, username);
      websocketService.onStatusUpdate(setUsers);
      isConnected.current = true;
    }

    return () => {
      websocketService.disconnect();
      isConnected.current = false;
    };
  }, [userId, username, setUsers]);
}; 