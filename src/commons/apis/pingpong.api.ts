import { API_ENDPOINTS } from "../../constants/endPoint.constants";
import {
  PingMessage,
  PongMessage,
  PingPongConfig,
  ConnectionStatus,
  PingPongStats,
} from "../../types/pingpong.types";

/**
 * 핑퐁 서비스 클래스
 * 
 * AWS WebSocket을 통한 실시간 연결 상태 확인 및 핑퐁 메시지 처리를 담당합니다.
 * 
 * 주요 기능:
 * - WebSocket 연결 관리 (연결, 해제, 재연결)
 * - 주기적 핑 메시지 전송 (기본 30초 간격)
 * - 퐁 응답 대기 및 타임아웃 처리 (기본 10초)
 * - 연결 품질 모니터링 및 통계 수집
 * - 자동 재연결 로직 (지수 백오프)
 * - 세션 관리 및 상태 추적
 * 
 * 사용 예시:
 * ```typescript
 * const pingPongService = new PingPongService();
 * await pingPongService.connect("user123", "사용자명");
 * pingPongService.onConnectionStatusChange((status) => {
 *   console.log("연결 상태:", status);
 * });
 * ```
 */
class PingPongService {
  /** WebSocket 연결 인스턴스 */
  private ws: WebSocket | null = null;
  /** 핑 전송 간격 타이머 */
  private pingInterval: number | null = null;
  /** 퐁 응답 대기 타이머 */
  private pongTimeout: number | null = null;
  /** 재연결 시도 횟수 */
  private reconnectAttempts = 0;
  /** 최대 재연결 시도 횟수 */
  private maxReconnectAttempts = 5;
  /** 재연결 시도 간격 (밀리초) */
  private reconnectDelay = 1000;
  /** 연결 중인지 여부 */
  private isConnecting = false;
  /** 현재 세션 ID */
  private sessionId: string | null = null;
  /** 핑퐁 통계 정보 */
  private stats: PingPongStats = {
    totalPings: 0,
    totalPongs: 0,
    averageLatency: 0,
    connectionUptime: 0,
    lastActivity: 0,
  };
  /** 연결 시작 시간 (Unix timestamp) */
  private connectionStartTime: number = 0;
  /** 연결 상태 변경 콜백 함수 */
  private connectionStatusCallback: ((status: ConnectionStatus) => void) | null = null;
  /** 통계 업데이트 콜백 함수 */
  private statsUpdateCallback: ((stats: PingPongStats) => void) | null = null;

  constructor() {
    // 메서드 바인딩
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * 핑퐁 연결을 시작합니다.
   * 
   * @param userId - 사용자 고유 ID
   * @param username - 사용자명
   * @param config - 핑퐁 설정 옵션 (선택사항)
   * 
   * @throws {Error} WebSocket 연결 실패 시
   * 
   * 연결 과정:
   * 1. 기존 연결이 있으면 재사용
   * 2. 새로운 세션 ID 생성
   * 3. WebSocket 연결 시도
   * 4. 연결 성공 시 핑 간격 시작
   * 5. 연결 실패 시 자동 재연결 시도
   */
  async connect(
    userId: string,
    username: string,
    config?: Partial<PingPongConfig>
  ): Promise<void> {
    // 이미 연결되어 있거나 연결 중인 경우 중복 연결 방지
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.sessionId = this.generateSessionId();

    try {
      // WebSocket URL 생성 (쿼리 파라미터 포함)
      const wsUrl = `${API_ENDPOINTS.WEBSOCKET.CONNECT}?userId=${userId}&username=${encodeURIComponent(
        username
      )}&sessionId=${this.sessionId}`;
      this.ws = new WebSocket(wsUrl);

      // 연결 성공 시 처리
      this.ws.onopen = () => {
        console.log("핑퐁 연결됨");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.connectionStartTime = Date.now();
        this.startPingInterval(config);
        this.connectionStatusCallback?.({
          isConnected: true,
          connectionQuality: "excellent",
        });
      };

      // 이벤트 핸들러 등록
      this.ws.onmessage = this.handleMessage;
      this.ws.onclose = this.handleClose;
      this.ws.onerror = this.handleError;
    } catch (error) {
      console.error("핑퐁 연결 실패:", error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  /**
   * 핑퐁 연결을 해제합니다.
   * 
   * 연결 해제 과정:
   * 1. 핑 간격 타이머 중지
   * 2. 퐁 타임아웃 타이머 중지
   * 3. WebSocket 연결 종료
   * 4. 세션 정보 초기화
   * 5. 연결 상태 변경 알림
   */
  disconnect(): void {
    this.stopPingInterval();
    this.clearPongTimeout();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.sessionId = null;
    this.connectionStartTime = 0;
    this.connectionStatusCallback?.({
      isConnected: false,
      connectionQuality: "disconnected",
    });
  }

  /**
   * 핑 간격을 시작합니다.
   * 
   * @param config - 핑퐁 설정 (선택사항)
   * 
   * 기존 핑 간격이 있으면 중지하고 새로운 간격으로 시작합니다.
   * 설정이 없으면 기본값(30초)을 사용합니다.
   */
  private startPingInterval(config?: Partial<PingPongConfig>): void {
    this.stopPingInterval();

    const pingInterval = config?.pingInterval || API_ENDPOINTS.WEBSOCKET.PING_INTERVAL;
    this.pingInterval = window.setInterval(() => {
      this.sendPing();
    }, pingInterval);
  }

  /**
   * 핑 간격을 중지합니다.
   * 
   * 현재 실행 중인 핑 간격 타이머를 중지하고 null로 설정합니다.
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * 핑 메시지를 전송합니다.
   * 
   * WebSocket이 연결된 상태에서만 핑 메시지를 전송합니다.
   * 메시지 전송 후 퐁 타임아웃을 시작합니다.
   */
  private sendPing(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const pingMessage: PingMessage = {
        type: "ping",
        userId: this.getUserIdFromUrl(),
        timestamp: Date.now(),
        sessionId: this.sessionId || undefined,
      };

      this.ws.send(JSON.stringify(pingMessage));
      this.stats.totalPings++;
      this.stats.lastActivity = Date.now();
      this.startPongTimeout();
      this.updateStats();
    }
  }

  /**
   * 퐁 타임아웃을 시작합니다.
   * 
   * 기존 퐁 타임아웃이 있으면 중지하고 새로운 타임아웃을 시작합니다.
   * 타임아웃 시간 내에 퐁 응답이 없으면 재연결을 시도합니다.
   */
  private startPongTimeout(): void {
    this.clearPongTimeout();

    this.pongTimeout = window.setTimeout(() => {
      console.warn("퐁 응답 시간 초과 - 연결 재시도");
      this.handleReconnect();
    }, API_ENDPOINTS.WEBSOCKET.PONG_TIMEOUT);
  }

  /**
   * 퐁 타임아웃을 클리어합니다.
   * 
   * 현재 실행 중인 퐁 타임아웃 타이머를 중지하고 null로 설정합니다.
   */
  private clearPongTimeout(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  /**
   * WebSocket 메시지를 처리합니다.
   * 
   * @param event - WebSocket 메시지 이벤트
   * 
   * 수신된 메시지를 파싱하여 타입에 따라 적절한 처리를 수행합니다.
   * - pong: 퐁 응답 처리
   * - 기타: 알 수 없는 메시지 타입 로깅
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: PongMessage = JSON.parse(event.data);

      if (message.type === "pong") {
        this.handlePong(message);
      }
    } catch (error) {
      console.error("메시지 파싱 오류:", error);
    }
  }

  /**
   * 퐁 메시지를 처리합니다.
   * 
   * @param message - 수신된 퐁 메시지
   * 
   * 퐁 메시지 처리 과정:
   * 1. 퐁 타임아웃 클리어
   * 2. 통계 업데이트 (퐁 수신 횟수 증가)
   * 3. 응답 시간 계산 및 평균 업데이트
   * 4. 연결 품질 평가 및 업데이트
   */
  private handlePong(message: PongMessage): void {
    this.clearPongTimeout();
    this.stats.totalPongs++;
    this.stats.lastActivity = Date.now();

    // 응답 시간 계산 (현재 시간 - 메시지 타임스탬프)
    const responseTime = Date.now() - message.timestamp;
    if (message.responseTime) {
      // 평균 응답 시간 업데이트 (이동 평균)
      this.stats.averageLatency = 
        (this.stats.averageLatency * (this.stats.totalPongs - 1) + responseTime) / this.stats.totalPongs;
    }

    this.updateStats();
    this.updateConnectionQuality(responseTime);
  }

  /**
   * 연결 품질을 업데이트합니다.
   * 
   * @param latency - 응답 시간 (밀리초)
   * 
   * 응답 시간에 따라 연결 품질을 자동으로 평가합니다:
   * - 0-500ms: excellent (우수)
   * - 500-1000ms: good (양호)
   * - 1000ms 이상: poor (불량)
   */
  private updateConnectionQuality(latency: number): void {
    let quality: ConnectionStatus["connectionQuality"] = "excellent";
    
    if (latency > 1000) {
      quality = "poor";
    } else if (latency > 500) {
      quality = "good";
    }

    this.connectionStatusCallback?.({
      isConnected: true,
      lastPingTime: this.stats.lastActivity,
      lastPongTime: Date.now(),
      latency,
      connectionQuality: quality,
    });
  }

  /**
   * 통계를 업데이트합니다.
   * 
   * 현재 통계 정보를 업데이트하고 콜백 함수를 호출합니다.
   * 연결 유지 시간은 연결 시작 시간부터 현재까지의 시간을 계산합니다.
   */
  private updateStats(): void {
    if (this.connectionStartTime > 0) {
      this.stats.connectionUptime = Date.now() - this.connectionStartTime;
    }
    this.statsUpdateCallback?.(this.stats);
  }

  /**
   * WebSocket 연결 종료를 처리합니다.
   * 
   * @param event - WebSocket 종료 이벤트
   * 
   * 연결 종료 시:
   * 1. 핑 간격 및 퐁 타임아웃 중지
   * 2. 연결 상태 변경 알림
   * 3. 정상 종료가 아닌 경우 재연결 시도
   */
  private handleClose(event: CloseEvent): void {
    console.log("핑퐁 연결 종료:", event.code, event.reason);
    this.stopPingInterval();
    this.clearPongTimeout();
    this.connectionStatusCallback?.({
      isConnected: false,
      connectionQuality: "disconnected",
    });

    // 정상 종료가 아닌 경우 재연결 시도
    if (event.code !== 1000) {
      this.handleReconnect();
    }
  }

  /**
   * WebSocket 오류를 처리합니다.
   * 
   * @param error - WebSocket 오류 이벤트
   * 
   * 오류 발생 시 연결 상태를 disconnected로 변경하고 알림을 보냅니다.
   */
  private handleError(error: Event): void {
    console.error("핑퐁 오류:", error);
    this.connectionStatusCallback?.({
      isConnected: false,
      connectionQuality: "disconnected",
    });
  }

  /**
   * 재연결을 처리합니다.
   * 
   * 지수 백오프(exponential backoff) 방식을 사용하여 재연결을 시도합니다.
   * 최대 재시도 횟수를 초과하면 재연결을 중단합니다.
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("최대 재연결 시도 횟수 초과");
      return;
    }

    this.reconnectAttempts++;
    // 지수 백오프: 1초, 2초, 4초, 8초, 16초...
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
   * 세션 ID를 생성합니다.
   * 
   * @returns 고유한 세션 ID 문자열
   * 
   * 현재 시간과 랜덤 문자열을 조합하여 고유한 세션 ID를 생성합니다.
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * URL에서 userId를 추출합니다.
   * 
   * @returns 사용자 ID 또는 빈 문자열
   * 
   * 현재 페이지의 URL 쿼리 파라미터에서 userId를 추출합니다.
   */
  private getUserIdFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId") || "";
  }

  /**
   * URL에서 username을 추출합니다.
   * 
   * @returns 사용자명 또는 빈 문자열
   * 
   * 현재 페이지의 URL 쿼리 파라미터에서 username을 추출합니다.
   */
  private getUsernameFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("username") || "";
  }

  /**
   * 연결 상태 변경 콜백을 설정합니다.
   * 
   * @param callback - 연결 상태 변경 시 호출될 콜백 함수
   * 
   * 연결 상태가 변경될 때마다 이 콜백 함수가 호출됩니다.
   */
  onConnectionStatusChange(callback: (status: ConnectionStatus) => void): void {
    this.connectionStatusCallback = callback;
  }

  /**
   * 통계 업데이트 콜백을 설정합니다.
   * 
   * @param callback - 통계 업데이트 시 호출될 콜백 함수
   * 
   * 통계가 업데이트될 때마다 이 콜백 함수가 호출됩니다.
   */
  onStatsUpdate(callback: (stats: PingPongStats) => void): void {
    this.statsUpdateCallback = callback;
  }

  /**
   * 연결 상태를 확인합니다.
   * 
   * @returns 연결 상태 (true: 연결됨, false: 연결 끊김)
   * 
   * WebSocket의 readyState를 확인하여 연결 상태를 반환합니다.
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 현재 통계를 반환합니다.
   * 
   * @returns 현재 핑퐁 통계 정보의 복사본
   * 
   * 통계 객체의 복사본을 반환하여 외부에서 수정할 수 없도록 합니다.
   */
  getStats(): PingPongStats {
    return { ...this.stats };
  }
}

// 싱글톤 인스턴스 생성
const pingPongService = new PingPongService();

export default pingPongService; 