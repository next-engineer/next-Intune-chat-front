import { config } from './config';

export const API_ENDPOINTS = {
  BASE_URL: config.API_URL,
  
  // User endpoints
  USER: {
    SIGN_IN: 'user/signin',
    SIGN_UP: 'user/signup',
    MATCH: 'user/match',
    CHECK_EMAIL_DUPLICATE: 'user/check-email',
    CHECK_NICKNAME_DUPLICATE: 'user/check-name',
  },
  
  // Chat endpoints
  CHAT: {
    LIST: 'users/list',
    ROOM: 'users/room',
    SEND_MESSAGE: 'users/message',
  },

  // Notion API endpoints
  NOTION: {
    BASE_URL: 'https://api.notion.com/v1',
    DATABASES: '/databases',
    PAGES: '/pages',
    BLOCKS: '/blocks',
    SEARCH: '/search',
  },

  // AWS WebSocket endpoints
  WEBSOCKET: {
    CONNECT: config.WEBSOCKET_URL,
    PING_INTERVAL: config.WEBSOCKET_PING_INTERVAL, // 30초마다 핑
    PONG_TIMEOUT: config.WEBSOCKET_PONG_TIMEOUT,  // 10초 내에 퐁 응답 없으면 오프라인
  },
} as const; 