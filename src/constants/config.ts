// ========================================
// 환경 변수 설정 관리 파일
// ========================================

// 환경 변수 타입 정의
interface Config {
  // API 설정
  API_URL: string;
  API_TIMEOUT: number;
  
  // WebSocket 설정
  WEBSOCKET_URL: string;
  WEBSOCKET_PING_INTERVAL: number;
  WEBSOCKET_PONG_TIMEOUT: number;
  
  // Notion API 설정
  NOTION_API_KEY: string;
  NOTION_DATABASE_ID: string;
  
  // 개발 환경 설정
  DEV_MODE: boolean;
  DEBUG_MODE: boolean;
  
  // 기능 플래그
  ENABLE_CHAT: boolean;
  ENABLE_NOTION: boolean;
  ENABLE_PINGPONG: boolean;
  
  // 빌드 설정
  APP_NAME: string;
  APP_VERSION: string;
  
  // AWS 설정
  AWS_REGION: string;
  AWS_COGNITO_USER_POOL_ID: string;
  AWS_COGNITO_CLIENT_ID: string;
  AWS_S3_BUCKET_NAME: string;
  AWS_CLOUDFRONT_DISTRIBUTION_ID: string;
}

// 환경 변수에서 값을 가져오는 함수
const getEnvVar = (key: string, defaultValue?: any) => {
  const value = (import.meta as any).env?.[key];
  return value !== undefined ? value : defaultValue;
};

// 환경 변수에서 숫자를 가져오는 함수
const getEnvNumber = (key: string, defaultValue: number) => {
  const value = getEnvVar(key);
  return value ? parseInt(value, 10) : defaultValue;
};

// 환경 변수에서 불린을 가져오는 함수
const getEnvBoolean = (key: string, defaultValue: boolean) => {
  const value = getEnvVar(key);
  return value ? value === 'true' : defaultValue;
};

// 설정 객체 생성
export const config: Config = {
  // API 설정
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:8080'),
  API_TIMEOUT: getEnvNumber('VITE_API_TIMEOUT', 10000),
  
  // WebSocket 설정
  WEBSOCKET_URL: getEnvVar('VITE_WEBSOCKET_URL', 'wss://localhost:8080/ws'),
  WEBSOCKET_PING_INTERVAL: getEnvNumber('VITE_WEBSOCKET_PING_INTERVAL', 30000),
  WEBSOCKET_PONG_TIMEOUT: getEnvNumber('VITE_WEBSOCKET_PONG_TIMEOUT', 10000),
  
  // Notion API 설정
  NOTION_API_KEY: getEnvVar('VITE_NOTION_API_KEY', ''),
  NOTION_DATABASE_ID: getEnvVar('VITE_NOTION_DATABASE_ID', ''),
  
  // 개발 환경 설정
  DEV_MODE: getEnvBoolean('VITE_DEV_MODE', true),
  DEBUG_MODE: getEnvBoolean('VITE_DEBUG_MODE', false),
  
  // 기능 플래그
  ENABLE_CHAT: getEnvBoolean('VITE_ENABLE_CHAT', true),
  ENABLE_NOTION: getEnvBoolean('VITE_ENABLE_NOTION', true),
  ENABLE_PINGPONG: getEnvBoolean('VITE_ENABLE_PINGPONG', true),
  
  // 빌드 설정
  APP_NAME: getEnvVar('VITE_APP_NAME', 'Intune Front'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '0.1.0'),
  
  // AWS 설정
  AWS_REGION: getEnvVar('VITE_AWS_REGION', 'ap-northeast-2'),
  AWS_COGNITO_USER_POOL_ID: getEnvVar('VITE_AWS_COGNITO_USER_POOL_ID', ''),
  AWS_COGNITO_CLIENT_ID: getEnvVar('VITE_AWS_COGNITO_CLIENT_ID', ''),
  AWS_S3_BUCKET_NAME: getEnvVar('VITE_AWS_S3_BUCKET_NAME', ''),
  AWS_CLOUDFRONT_DISTRIBUTION_ID: getEnvVar('VITE_AWS_CLOUDFRONT_DISTRIBUTION_ID', ''),
};

// 환경 정보 출력 (개발 모드에서만)
if (config.DEV_MODE && config.DEBUG_MODE) {
  console.log('🌍 환경 설정 정보:', {
    API_URL: config.API_URL,
    WEBSOCKET_URL: config.WEBSOCKET_URL,
    DEV_MODE: config.DEV_MODE,
    DEBUG_MODE: config.DEBUG_MODE,
    APP_NAME: config.APP_NAME,
    APP_VERSION: config.APP_VERSION,
  });
}

export default config;
