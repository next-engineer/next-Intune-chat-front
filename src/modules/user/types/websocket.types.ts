export interface UserStatus {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface PingPongMessage {
  type: "ping" | "pong" | "status_update";
  userId: string;
  timestamp: number;
  data?: any;
}

export interface WebSocketConfig {
  url: string;
  pingInterval: number;
  pongTimeout: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
} 