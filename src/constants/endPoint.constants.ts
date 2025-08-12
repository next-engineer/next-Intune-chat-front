



export const API_ENDPOINTS = {
  BASE_URL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080',
  
  // User endpoints
  USER: {
    SIGN_IN: '/api/auth/signin',
    SIGN_UP: '/api/auth/signup',
    MATCH: '/api/user/match',
  },
  
  // Chat endpoints
  CHAT: {
    LIST: '/api/chat/list',
    ROOM: '/api/chat/room',
    SEND_MESSAGE: '/api/chat/message',
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
    CONNECT: (import.meta as any).env?.VITE_WEBSOCKET_URL || 'wss://your-api-gateway-url.execute-api.region.amazonaws.com/stage',
    PING_INTERVAL: 30000, // 30초마다 핑
    PONG_TIMEOUT: 10000,  // 10초 내에 퐁 응답 없으면 오프라인
  },
} as const; 