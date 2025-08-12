import React, { useState } from "react";
import { usePingPong } from "../../commons/hooks/usePingPong";
import PingPongStatus from "../../commons/components/PingPongStatus";
import OnlineStatus from "../../commons/components/OnlineStatus";

/**
 * 핑퐁 기능 테스트 페이지
 * 
 * 실시간 연결 상태와 핑퐁 통계를 확인할 수 있는 테스트 페이지입니다.
 * 
 * 주요 기능:
 * - 사용자 정보 입력 및 실시간 연결 테스트
 * - 핑퐁 연결 상태 시각적 표시
 * - 실시간 통계 정보 모니터링
 * - 연결 품질 및 응답 시간 확인
 * - 온라인/오프라인 상태 표시
 * 
 * 테스트 시나리오:
 * 1. 정상 연결 테스트: 사용자 정보 입력 후 자동 연결 확인
 * 2. 연결 끊김 테스트: 네트워크 연결을 끊어서 자동 재연결 확인
 * 3. 응답 시간 테스트: 핑/퐁 응답 시간 측정 및 품질 평가 확인
 */
const PingPongTestPage: React.FC = () => {
  // 사용자 정보 상태 관리
  const [userId, setUserId] = useState("test-user-123");
  const [username, setUsername] = useState("테스트 사용자");
  
  // 통계 표시 여부 상태 관리
  const [showStats, setShowStats] = useState(true);

  // 핑퐁 훅 사용 - 실시간 연결 상태 및 통계 추적
  const { connectionStatus, stats, isConnected, connectionQuality, latency } = usePingPong(
    userId,
    username,
    {
      pingInterval: 30000, // 30초마다 핑 전송
      pongTimeout: 10000,  // 10초 내 퐁 응답 대기
      maxRetries: 5,       // 최대 5회 재시도
      retryDelay: 1000,    // 1초 간격으로 재시도
    }
  );

  /**
   * 연결 시도 핸들러 (현재는 로깅만 수행)
   * 실제 연결은 usePingPong 훅에서 자동으로 처리됩니다.
   */
  const handleConnect = () => {
    console.log("핑퐁 연결 시도 중...");
  };

  /**
   * 연결 해제 핸들러 (현재는 로깅만 수행)
   * 실제 해제는 usePingPong 훅에서 자동으로 처리됩니다.
   */
  const handleDisconnect = () => {
    console.log("핑퐁 연결 해제 중...");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">핑퐁 기능 테스트</h1>
          <p className="text-gray-600">
            AWS WebSocket을 통한 실시간 연결 상태와 핑퐁 통계를 확인할 수 있습니다.
          </p>
        </div>

        {/* 사용자 정보 입력 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">사용자 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 사용자 ID 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자 ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사용자 ID를 입력하세요"
              />
            </div>
            {/* 사용자명 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자명
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사용자명을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 연결 상태 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 핑퐁 상태 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">핑퐁 연결 상태</h2>
            {/* 핑퐁 상태 컴포넌트 */}
            <PingPongStatus
              connectionStatus={connectionStatus}
              stats={stats}
              showStats={showStats}
            />
            {/* 통계 표시 토글 버튼 */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showStats ? "통계 숨기기" : "통계 보기"}
              </button>
            </div>
          </div>

          {/* 온라인 상태 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">온라인 상태</h2>
            <div className="flex items-center gap-4">
              {/* 현재 온라인 상태 표시 */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">현재 상태:</span>
                <OnlineStatus isOnline={isConnected} />
                <span className="text-sm text-gray-600">
                  {isConnected ? "온라인" : "오프라인"}
                </span>
              </div>
            </div>
            {/* 연결 품질 및 응답 시간 정보 */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">연결 품질:</span>
                <span className="text-sm font-medium text-gray-900">
                  {connectionQuality === "excellent" && "우수"}
                  {connectionQuality === "good" && "양호"}
                  {connectionQuality === "poor" && "불량"}
                  {connectionQuality === "disconnected" && "연결 끊김"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">응답 시간:</span>
                <span className="text-sm font-medium text-gray-900">
                  {latency ? `${latency}ms` : "측정 중"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 실시간 통계 섹션 (showStats가 true일 때만 표시) */}
        {showStats && stats && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">실시간 통계</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 핑 전송 횟수 */}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalPings}</div>
                <div className="text-sm text-gray-600">핑 전송</div>
              </div>
              {/* 퐁 수신 횟수 */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalPongs}</div>
                <div className="text-sm text-gray-600">퐁 수신</div>
              </div>
              {/* 평균 응답시간 */}
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.averageLatency > 0 ? `${Math.round(stats.averageLatency)}ms` : "0ms"}
                </div>
                <div className="text-sm text-gray-600">평균 응답시간</div>
              </div>
              {/* 연결 유지시간 */}
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.floor(stats.connectionUptime / 1000)}s
                </div>
                <div className="text-sm text-gray-600">연결 유지시간</div>
              </div>
            </div>
          </div>
        )}

        {/* 연결 정보 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">연결 정보</h2>
          <div className="space-y-2">
            {/* WebSocket URL */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">WebSocket URL:</span>
              <span className="text-sm text-gray-900 font-mono">
                {(import.meta as any).env?.VITE_WEBSOCKET_URL || "설정되지 않음"}
              </span>
            </div>
            {/* 핑 간격 */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">핑 간격:</span>
              <span className="text-sm text-gray-900">30초</span>
            </div>
            {/* 퐁 타임아웃 */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">퐁 타임아웃:</span>
              <span className="text-sm text-gray-900">10초</span>
            </div>
            {/* 최대 재시도 */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">최대 재시도:</span>
              <span className="text-sm text-gray-900">5회</span>
            </div>
          </div>
        </div>

        {/* 사용법 안내 섹션 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">사용법</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• 사용자 정보를 입력하면 자동으로 핑퐁 연결이 시작됩니다.</li>
            <li>• 연결 상태는 실시간으로 업데이트됩니다.</li>
            <li>• 핑/퐁 통계는 연결 유지 시간 동안 누적됩니다.</li>
            <li>• 연결이 끊어지면 자동으로 재연결을 시도합니다.</li>
            <li>• 응답 시간에 따라 연결 품질이 자동으로 평가됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PingPongTestPage; 