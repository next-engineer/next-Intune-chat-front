import { useEffect, useRef, useState } from "react";
import pingPongService from "../apis/pingpong.api";
import { ConnectionStatus, PingPongStats, PingPongConfig } from "../../types/pingpong.types";

/**
 * 핑퐁 기능을 관리하는 React 훅
 * 
 * 컴포넌트에서 쉽게 핑퐁 연결을 사용할 수 있도록 래핑합니다.
 * 
 * 주요 기능:
 * - 자동 연결 관리 (컴포넌트 마운트 시 연결, 언마운트 시 해제)
 * - 실시간 연결 상태 및 통계 추적
 * - 연결 상태 변경 및 통계 업데이트 콜백 처리
 * - 설정 옵션 지원
 * 
 * 사용 예시:
 * ```typescript
 * const { connectionStatus, stats, isConnected, connectionQuality, latency } = usePingPong(
 *   "user123",
 *   "사용자명",
 *   { pingInterval: 30000, pongTimeout: 10000 }
 * );
 * ```
 * 
 * @param userId - 사용자 고유 ID
 * @param username - 사용자명
 * @param config - 핑퐁 설정 옵션 (선택사항)
 * @returns 핑퐁 연결 상태 및 통계 정보
 */
export const usePingPong = (
  userId: string,
  username: string,
  config?: Partial<PingPongConfig>
) => {
  // 연결 상태 관리
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    connectionQuality: "disconnected",
  });

  // 통계 정보 관리
  const [stats, setStats] = useState<PingPongStats>({
    totalPings: 0,
    totalPongs: 0,
    averageLatency: 0,
    connectionUptime: 0,
    lastActivity: 0,
  });

  // 연결 상태 추적 (중복 연결 방지용)
  const isConnected = useRef(false);

  useEffect(() => {
    // 이미 연결된 경우 중복 연결 방지
    if (!isConnected.current) {
      // 연결 상태 변경 콜백 설정
      // 연결 상태가 변경될 때마다 상태를 업데이트합니다
      pingPongService.onConnectionStatusChange((status) => {
        setConnectionStatus(status);
      });

      // 통계 업데이트 콜백 설정
      // 통계가 업데이트될 때마다 상태를 업데이트합니다
      pingPongService.onStatsUpdate((newStats) => {
        setStats(newStats);
      });

      // 핑퐁 연결 시작
      // 사용자 정보와 설정을 전달하여 연결을 시작합니다
      pingPongService.connect(userId, username, config);
      isConnected.current = true;
    }

    // 컴포넌트 언마운트 시 연결 해제
    // 클린업 함수로 연결을 해제하고 상태를 초기화합니다
    return () => {
      pingPongService.disconnect();
      isConnected.current = false;
    };
  }, [userId, username, config]); // 의존성 배열: 사용자 정보나 설정이 변경되면 재연결

  // 훅에서 반환할 값들
  return {
    // 전체 연결 상태 객체
    connectionStatus,
    // 핑퐁 통계 정보
    stats,
    // 연결 상태 (boolean)
    isConnected: connectionStatus.isConnected,
    // 연결 품질 (excellent | good | poor | disconnected)
    connectionQuality: connectionStatus.connectionQuality,
    // 응답 시간 (밀리초)
    latency: connectionStatus.latency,
  };
}; 