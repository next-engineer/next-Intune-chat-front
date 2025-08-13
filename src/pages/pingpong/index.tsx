import React, { useState } from "react";
import { usePingPong } from "../../hooks/usePingPong";
import PingPongStatus from "../../components/PingPongStatus";
import OnlineStatus from "../../components/OnlineStatus";

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
 * - 가짜 유저를 통한 다양한 테스트 시나리오
 * 
 * 테스트 시나리오:
 * 1. 정상 연결 테스트: 사용자 정보 입력 후 자동 연결 확인
 * 2. 연결 끊김 테스트: 네트워크 연결을 끊어서 자동 재연결 확인
 * 3. 응답 시간 테스트: 핑/퐁 응답 시간 측정 및 품질 평가 확인
 * 4. 다중 유저 테스트: 여러 가짜 유저로 동시 연결 테스트
 */

// 가짜 유저 데이터 정의
const FAKE_USERS = [
  {
    id: "test-user-001",
    name: "김테스터",
    description: "기본 테스트 유저",
    avatar: "👨‍💻"
  },
  {
    id: "test-user-002", 
    name: "이개발자",
    description: "개발자 테스트 유저",
    avatar: "👩‍💻"
  },
  {
    id: "test-user-003",
    name: "박디자이너", 
    description: "디자이너 테스트 유저",
    avatar: "🎨"
  },
  {
    id: "test-user-004",
    name: "최기획자",
    description: "기획자 테스트 유저", 
    avatar: "📋"
  },
  {
    id: "test-user-005",
    name: "정관리자",
    description: "관리자 테스트 유저",
    avatar: "👔"
  },
  {
    id: "test-user-006",
    name: "강운영자",
    description: "운영자 테스트 유저",
    avatar: "🔧"
  },
  {
    id: "test-user-007",
    name: "윤분석가",
    description: "데이터 분석가 테스트 유저",
    avatar: "📊"
  },
  {
    id: "test-user-008",
    name: "임마케터",
    description: "마케터 테스트 유저",
    avatar: "📢"
  }
];

const PingPongTestPage: React.FC = () => {
  // 사용자 정보 상태 관리
  const [userId, setUserId] = useState("test-user-001");
  const [username, setUsername] = useState("김테스터");
  
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
   * 가짜 유저 선택 핸들러
   */
  const handleFakeUserSelect = (user: typeof FAKE_USERS[0]) => {
    setUserId(user.id);
    setUsername(user.name);
  };

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
      <div className="max-w-6xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">핑퐁 기능 테스트</h1>
          <p className="text-gray-600">
            AWS WebSocket을 통한 실시간 연결 상태와 핑퐁 통계를 확인할 수 있습니다.
          </p>
        </div>

        {/* 가짜 유저 선택 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">가짜 유저 선택</h2>
          <p className="text-gray-600 mb-4">
            다양한 테스트 시나리오를 위한 가짜 유저를 선택하세요.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FAKE_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleFakeUserSelect(user)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  userId === user.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">{user.avatar}</div>
                <div className="font-semibold text-sm text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.description}</div>
                <div className="text-xs text-gray-400 mt-1">{user.id}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 사용자 정보 입력 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">현재 선택된 사용자</h2>
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
            <li>• 가짜 유저를 선택하면 자동으로 핑퐁 연결이 시작됩니다.</li>
            <li>• 연결 상태는 실시간으로 업데이트됩니다.</li>
            <li>• 핑/퐁 통계는 연결 유지 시간 동안 누적됩니다.</li>
            <li>• 연결이 끊어지면 자동으로 재연결을 시도합니다.</li>
            <li>• 응답 시간에 따라 연결 품질이 자동으로 평가됩니다.</li>
          </ul>
        </div>

        {/* 테스트 시나리오 섹션 */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">테스트 시나리오</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🎯 기본 연결 테스트</h4>
              <p className="text-sm text-green-700">
                가짜 유저를 선택하여 기본적인 핑퐁 연결을 테스트합니다.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🔄 재연결 테스트</h4>
              <p className="text-sm text-green-700">
                네트워크 연결을 끊어서 자동 재연결 기능을 테스트합니다.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">📊 통계 모니터링</h4>
              <p className="text-sm text-green-700">
                실시간 통계를 통해 연결 품질과 응답 시간을 모니터링합니다.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">👥 다중 유저 테스트</h4>
              <p className="text-sm text-green-700">
                여러 가짜 유저로 동시 연결을 시뮬레이션합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 가짜 유저 정보 섹션 */}
        <div className="mt-8 bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">가짜 유저 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FAKE_USERS.map((user) => (
              <div key={user.id} className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <div className="font-semibold text-purple-900">{user.name}</div>
                    <div className="text-xs text-purple-600">{user.id}</div>
                  </div>
                </div>
                <p className="text-sm text-purple-700">{user.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 개발자 정보 섹션 */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">개발자 정보</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>• 이 페이지는 핑퐁 기능의 개발 및 테스트를 위해 제작되었습니다.</p>
            <p>• 실제 서비스에서는 실제 사용자 인증 시스템을 사용합니다.</p>
            <p>• WebSocket 연결은 AWS 서비스를 통해 관리됩니다.</p>
            <p>• 모든 테스트 데이터는 로컬에서만 사용되며 서버에 저장되지 않습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PingPongTestPage; 