import React from "react";
import { ConnectionStatus, PingPongStats } from "../../types/pingpong.types";

/**
 * 핑퐁 상태 컴포넌트의 Props 인터페이스
 */
interface PingPongStatusProps {
  /** 현재 연결 상태 정보 */
  connectionStatus: ConnectionStatus;
  /** 핑퐁 통계 정보 (선택사항) */
  stats?: PingPongStats;
  /** 통계 정보 표시 여부 (기본값: false) */
  showStats?: boolean;
}

/**
 * 핑퐁 연결 상태를 표시하는 컴포넌트
 * 
 * 연결 품질과 핑퐁 통계를 시각적으로 표시합니다.
 * 
 * 주요 기능:
 * - 연결 상태 시각적 표시 (색상별 원형 인디케이터)
 * - 연결 품질 텍스트 표시 (우수/양호/불량/연결끊김)
 * - 응답 시간 표시 (밀리초 단위)
 * - 통계 정보 표시 (핑/퐁 횟수, 평균 응답시간, 연결 유지시간)
 * 
 * 사용 예시:
 * ```typescript
 * <PingPongStatus
 *   connectionStatus={connectionStatus}
 *   stats={stats}
 *   showStats={true}
 * />
 * ```
 */
const PingPongStatus: React.FC<PingPongStatusProps> = ({
  connectionStatus,
  stats,
  showStats = false,
}) => {
  /**
   * 연결 품질에 따른 색상을 반환합니다.
   * 
   * @param quality - 연결 품질
   * @returns Tailwind CSS 클래스명
   * 
   * 연결 품질별 색상:
   * - excellent: 초록색 (bg-green-500)
   * - good: 노란색 (bg-yellow-500)
   * - poor: 빨간색 (bg-red-500)
   * - disconnected: 회색 (bg-gray-400)
   */
  const getQualityColor = (quality: ConnectionStatus["connectionQuality"]) => {
    switch (quality) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-yellow-500";
      case "poor":
        return "bg-red-500";
      case "disconnected":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  /**
   * 연결 품질에 따른 텍스트를 반환합니다.
   * 
   * @param quality - 연결 품질
   * @returns 연결 품질 텍스트
   * 
   * 연결 품질별 텍스트:
   * - excellent: "우수"
   * - good: "양호"
   * - poor: "불량"
   * - disconnected: "연결 끊김"
   */
  const getQualityText = (quality: ConnectionStatus["connectionQuality"]) => {
    switch (quality) {
      case "excellent":
        return "우수";
      case "good":
        return "양호";
      case "poor":
        return "불량";
      case "disconnected":
        return "연결 끊김";
      default:
        return "알 수 없음";
    }
  };

  /**
   * 응답 시간을 포맷팅합니다.
   * 
   * @param latency - 응답 시간 (밀리초)
   * @returns 포맷팅된 응답 시간 문자열
   * 
   * 응답 시간이 없으면 "측정 중"을 반환하고,
   * 있으면 "XXXms" 형태로 반환합니다.
   */
  const formatLatency = (latency?: number) => {
    if (!latency) return "측정 중";
    return `${latency}ms`;
  };

  /**
   * 연결 유지시간을 포맷팅합니다.
   * 
   * @param uptime - 연결 유지시간 (밀리초)
   * @returns 포맷팅된 연결 유지시간 문자열
   * 
   * 연결 유지시간을 시간, 분, 초 단위로 변환하여 표시합니다:
   * - 1시간 이상: "X시간 Y분"
   * - 1분 이상: "X분 Y초"
   * - 1분 미만: "X초"
   */
  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
      return `${minutes}분 ${seconds}초`;
    } else {
      return `${seconds}초`;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-lg shadow-sm border">
      {/* 연결 상태 섹션 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">연결 상태</span>
        <div className="flex items-center gap-2">
          {/* 연결 품질 인디케이터 (원형) */}
          <div
            className={`w-3 h-3 rounded-full ${getQualityColor(
              connectionStatus.connectionQuality
            )}`}
          />
          {/* 연결 품질 텍스트 */}
          <span className="text-sm text-gray-600">
            {getQualityText(connectionStatus.connectionQuality)}
          </span>
        </div>
      </div>

      {/* 응답 시간 섹션 (응답 시간이 있을 때만 표시) */}
      {connectionStatus.latency && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">응답 시간</span>
          <span className="text-sm text-gray-600">
            {formatLatency(connectionStatus.latency)}
          </span>
        </div>
      )}

      {/* 통계 정보 섹션 (showStats가 true이고 stats가 있을 때만 표시) */}
      {showStats && stats && (
        <>
          <div className="border-t pt-2">
            {/* 핑 전송 횟수 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">핑 전송</span>
              <span className="text-sm text-gray-600">{stats.totalPings}회</span>
            </div>
            {/* 퐁 수신 횟수 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">퐁 수신</span>
              <span className="text-sm text-gray-600">{stats.totalPongs}회</span>
            </div>
            {/* 평균 응답시간 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">평균 응답시간</span>
              <span className="text-sm text-gray-600">
                {formatLatency(stats.averageLatency)}
              </span>
            </div>
            {/* 연결 유지시간 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">연결 유지시간</span>
              <span className="text-sm text-gray-600">
                {formatUptime(stats.connectionUptime)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PingPongStatus; 