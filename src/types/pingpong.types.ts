/**
 * 핑퐁 메시지 타입 정의
 * AWS WebSocket을 통한 실시간 연결 상태 확인을 위한 타입들
 * 
 * 이 파일은 핑퐁 기능에서 사용되는 모든 타입 정의를 포함합니다.
 * - PingMessage: 클라이언트에서 서버로 전송하는 핑 메시지
 * - PongMessage: 서버에서 클라이언트로 응답하는 퐁 메시지
 * - PingPongConfig: 핑퐁 설정 옵션
 * - ConnectionStatus: 연결 상태 정보
 * - PingPongStats: 핑퐁 통계 정보
 */

/**
 * 핑 메시지 인터페이스
 * 클라이언트에서 서버로 전송하여 연결 상태를 확인하는 메시지
 */
export interface PingMessage {
  /** 메시지 타입 - 항상 "ping" */
  type: "ping";
  /** 사용자 고유 ID */
  userId: string;
  /** 메시지 전송 시간 (Unix timestamp) */
  timestamp: number;
  /** 세션 ID - 연결 추적을 위한 고유 식별자 */
  sessionId?: string;
}

/**
 * 퐁 메시지 인터페이스
 * 서버에서 클라이언트로 응답하여 연결 상태를 확인하는 메시지
 */
export interface PongMessage {
  /** 메시지 타입 - 항상 "pong" */
  type: "pong";
  /** 사용자 고유 ID */
  userId: string;
  /** 메시지 전송 시간 (Unix timestamp) */
  timestamp: number;
  /** 세션 ID - 연결 추적을 위한 고유 식별자 */
  sessionId?: string;
  /** 서버 응답 시간 (ms) - 클라이언트에서 계산용 */
  responseTime?: number;
}

/**
 * 핑퐁 설정 인터페이스
 * 핑퐁 기능의 동작을 제어하는 설정 옵션들
 */
export interface PingPongConfig {
  /** 핑 전송 간격 (밀리초) - 기본값: 30000ms (30초) */
  pingInterval: number;
  /** 퐁 응답 대기 시간 (밀리초) - 기본값: 10000ms (10초) */
  pongTimeout: number;
  /** 최대 재시도 횟수 - 연결 실패 시 재시도할 횟수 */
  maxRetries: number;
  /** 재시도 간격 (밀리초) - 재연결 시도 간의 대기 시간 */
  retryDelay: number;
}

/**
 * 연결 상태 인터페이스
 * 현재 WebSocket 연결의 상태 정보
 */
export interface ConnectionStatus {
  /** 연결 상태 - true: 연결됨, false: 연결 끊김 */
  isConnected: boolean;
  /** 마지막 핑 전송 시간 (Unix timestamp) */
  lastPingTime?: number;
  /** 마지막 퐁 수신 시간 (Unix timestamp) */
  lastPongTime?: number;
  /** 응답 시간 (밀리초) - 핑-퐁 사이의 시간 */
  latency?: number;
  /** 연결 품질 - 응답 시간에 따른 자동 평가 */
  connectionQuality: "excellent" | "good" | "poor" | "disconnected";
}

/**
 * 핑퐁 통계 인터페이스
 * 핑퐁 연결의 통계 정보
 */
export interface PingPongStats {
  /** 총 핑 전송 횟수 */
  totalPings: number;
  /** 총 퐁 수신 횟수 */
  totalPongs: number;
  /** 평균 응답 시간 (밀리초) */
  averageLatency: number;
  /** 연결 유지 시간 (밀리초) - 연결 시작부터 현재까지 */
  connectionUptime: number;
  /** 마지막 활동 시간 (Unix timestamp) */
  lastActivity: number;
} 