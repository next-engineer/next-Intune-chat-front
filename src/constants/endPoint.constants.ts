import { config } from "./config";

export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    SIGN_IN: `${config.USER_API_URL}/user/sign-in`,
    SIGN_UP: `${config.USER_API_URL}/user/sign-up`,
    MATCH: `${config.CHAT_API_URL}/chat/match`,
    CHECK_EMAIL_DUPLICATE: `${config.USER_API_URL}/user/check-email`,
    CHECK_NICKNAME_DUPLICATE: `${config.USER_API_URL}/user/check-name`,
  },

  // Chat endpoints
  CHAT: {
    LIST: `${config.CHAT_API_URL}/chat/match`,
    ROOM: `${config.CHAT_API_URL}/chat/chat`,
    SEND_MESSAGE: `${config.CHAT_API_URL}/chat/chat`,
  },

  // AWS WebSocket endpoints
  WEBSOCKET: {
    CONNECT: config.WEBSOCKET_URL,
    PING_INTERVAL: config.WEBSOCKET_PING_INTERVAL, // 30초마다 핑
    PONG_TIMEOUT: config.WEBSOCKET_PONG_TIMEOUT, // 10초 내에 퐁 응답 없으면 오프라인
  },
} as const;
