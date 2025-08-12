import { API_ENDPOINTS } from "../../constants/endPoint.constants";
import { UserStatus, PingPongMessage, WebSocketConfig } from "../../types/websocket.types";

/**
 * WebSocket 서비스 클래스
 * AWS API Gateway WebSocket 연결을 관리하고 실시간 사용자 상태를 처리합니다.
 */
class WebSocketService {
  private ws: WebSocket | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private onStatusUpdate: ((users: UserStatus[]) => void) | null = null;
  private onConnectionChange: ((isConnected: boolean) => void) | null = null;

  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * WebSocket 연결을 시작합니다.
   * @param userId - 사용자 ID
   * @param username - 사용자명
   */
  async connect(userId: string, username: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const wsUrl = `${API_ENDPOINTS.WEBSOCKET.CONNECT}?userId=${userId}&username=${encodeURIComponent(username)}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket 연결됨");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startPingInterval();
        this.onConnectionChange?.(true);
      };

      this.ws.onmessage = this.handleMessage;
      this.ws.onclose = this.handleClose;
      this.ws.onerror = this.handleError;
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  /**
   * WebSocket 연결을 해제합니다.
   */
  disconnect(): void {
    this.stopPingInterval();
    this.clearPongTimeout();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.onConnectionChange?.(false);
  }

  /**
   * 핑 간격을 시작합니다.
   */
  private startPingInterval(): void {
    this.stopPingInterval();

    this.pingInterval = setInterval(() => {
      this.sendPing();
    }, API_ENDPOINTS.WEBSOCKET.PING_INTERVAL);
  }

  /**
   * 핑 간격을 중지합니다.
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * 핑 메시지를 전송합니다.
   */
  private sendPing(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const pingMessage: PingPongMessage = {
        type: "ping",
        userId: this.getUserIdFromUrl(),
        timestamp: Date.now(),
      };

      this.ws.send(JSON.stringify(pingMessage));
      this.startPongTimeout();
    }
  }

  /**
   * 퐁 타임아웃을 시작합니다.
   */
  private startPongTimeout(): void {
    this.clearPongTimeout();

    this.pongTimeout = setTimeout(() => {
      console.warn("퐁 응답 시간 초과 - 연결 재시도");
      this.handleReconnect();
    }, API_ENDPOINTS.WEBSOCKET.PONG_TIMEOUT);
  }

  /**
   * 퐁 타임아웃을 클리어합니다.
   */
  private clearPongTimeout(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  /**
   * WebSocket 메시지를 처리합니다.
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: PingPongMessage = JSON.parse(event.data);

      switch (message.type) {
        case "pong":
          this.clearPongTimeout();
          break;

        case "status_update":
          if (this.onStatusUpdate && message.data) {
            this.onStatusUpdate(message.data);
          }
          break;

        default:
          console.log("알 수 없는 메시지 타입:", message.type);
      }
    } catch (error) {
      console.error("메시지 파싱 오류:", error);
    }
  }

  /**
   * WebSocket 연결 종료를 처리합니다.
   */
  private handleClose(event: CloseEvent): void {
    console.log("WebSocket 연결 종료:", event.code, event.reason);
    this.stopPingInterval();
    this.clearPongTimeout();
    this.onConnectionChange?.(false);

    if (event.code !== 1000) {
      // 정상 종료가 아닌 경우
      this.handleReconnect();
    }
  }

  /**
   * WebSocket 오류를 처리합니다.
   */
  private handleError(error: Event): void {
    console.error("WebSocket 오류:", error);
    this.onConnectionChange?.(false);
  }

  /**
   * 재연결을 처리합니다.
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("최대 재연결 시도 횟수 초과");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        const userId = this.getUserIdFromUrl();
        const username = this.getUsernameFromUrl();
        if (userId && username) {
          this.connect(userId, username);
        }
      }
    }, delay);
  }

  /**
   * URL에서 userId를 추출합니다.
   */
  private getUserIdFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId") || "";
  }

  /**
   * URL에서 username을 추출합니다.
   */
  private getUsernameFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("username") || "";
  }

  /**
   * 상태 업데이트 콜백을 설정합니다.
   */
  onStatusUpdate(callback: (users: UserStatus[]) => void): void {
    this.onStatusUpdate = callback;
  }

  /**
   * 연결 상태 변경 콜백을 설정합니다.
   */
  onConnectionChange(callback: (isConnected: boolean) => void): void {
    this.onConnectionChange = callback;
  }

  /**
   * 연결 상태를 확인합니다.
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// 싱글톤 인스턴스 생성
const websocketService = new WebSocketService();

export default websocketService; 