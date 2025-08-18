import React, { useState, useEffect } from 'react';
import { usePingPong } from '../../commons/hooks/usePingPong';
import { config } from '../../constants/config';

/**
 * 네트워크 테스트 전용 페이지
 * 다른 컴퓨터와의 웹소켓 통신을 테스트할 수 있습니다.
 */
const NetworkTestPage: React.FC = () => {
  const [userId, setUserId] = useState(`user-${Date.now()}`);
  const [username, setUsername] = useState(`테스터-${Math.floor(Math.random() * 1000)}`);
  const [isConnected, setIsConnected] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  // 핑퐁 훅 사용
  const { connectionStatus, stats, connectionQuality, latency } = usePingPong(
    userId,
    username,
    {
      pingInterval: 30000,
      pongTimeout: 15000,
      maxRetries: 5,
      retryDelay: 1000,
    }
  );

  // 연결 상태 모니터링
  useEffect(() => {
    setIsConnected(connectionStatus.isConnected);
    
    if (connectionStatus.isConnected) {
      addTestResult('✅ 웹소켓 연결 성공');
    } else {
      addTestResult('❌ 웹소켓 연결 끊김');
    }
  }, [connectionStatus.isConnected]);

  // 연결 품질 모니터링
  useEffect(() => {
    if (connectionQuality) {
      addTestResult(`📊 연결 품질: ${connectionQuality}`);
    }
  }, [connectionQuality]);

  // 응답 시간 모니터링
  useEffect(() => {
    if (latency && latency > 0) {
      addTestResult(`⏱️ 응답 시간: ${latency}ms`);
    }
  }, [latency]);

  const addTestResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  const handleUserInfoChange = () => {
    const newUserId = `user-${Date.now()}`;
    const newUsername = `테스터-${Math.floor(Math.random() * 1000)}`;
    setUserId(newUserId);
    setUsername(newUsername);
    addTestResult(`🔄 사용자 정보 변경: ${newUsername} (${newUserId})`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌐 네트워크 통신 테스트
          </h1>
          <p className="text-lg text-gray-600">
            다른 컴퓨터와의 웹소켓 통신을 실시간으로 테스트합니다
          </p>
        </div>

        {/* 환경 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">🔧 환경 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">API URL:</span>
              {/* <p className="text-sm font-mono text-green-600">{config.API_URL}</p> */}
            </div>
            <div>
              <span className="text-sm text-gray-600">WebSocket URL:</span>
              <p className="text-sm font-mono text-blue-600">{config.WEBSOCKET_URL}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">현재 IP:</span>
              <p className="text-sm font-mono">192.168.12.110</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">포트:</span>
              <p className="text-sm font-mono">5173 (프론트엔드), 8080 (백엔드)</p>
            </div>
          </div>
        </div>

        {/* 연결 상태 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">📡 연결 상태</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl mb-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? '🟢' : '🔴'}
              </div>
              <p className="font-semibold">웹소켓 연결</p>
              <p className="text-sm text-gray-600">
                {isConnected ? '연결됨' : '연결 끊김'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-semibold">연결 품질</p>
              <p className="text-sm text-gray-600">{connectionQuality}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="font-semibold">응답 시간</p>
              <p className="text-sm text-gray-600">
                {latency ? `${latency}ms` : '측정 중'}
              </p>
            </div>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">👤 사용자 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자 ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자명
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleUserInfoChange}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            🔄 사용자 정보 변경
          </button>
        </div>

        {/* 통계 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">📈 통계 정보</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalPings}</p>
              <p className="text-sm text-gray-600">총 핑</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalPongs}</p>
              <p className="text-sm text-gray-600">총 퐁</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {stats.averageLatency ? `${Math.round(stats.averageLatency)}ms` : '-'}
              </p>
              <p className="text-sm text-gray-600">평균 응답시간</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(stats.connectionUptime / 1000)}s
              </p>
              <p className="text-sm text-gray-600">연결 시간</p>
            </div>
          </div>
        </div>

        {/* 테스트 결과 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📋 테스트 결과</h2>
            <button
              onClick={clearResults}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              🗑️ 결과 지우기
            </button>
          </div>
          <div className="bg-gray-50 rounded-md p-4 h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center">테스트 결과가 여기에 표시됩니다...</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 접속 정보 */}
        <div className="mt-6 text-center">
          <div className="bg-blue-100 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">🌐 다른 컴퓨터에서 접속하기</h3>
            <p className="text-blue-800 font-mono">
              http://192.168.12.110:5173/network-test
            </p>
            <p className="text-sm text-blue-700 mt-2">
              같은 WiFi 네트워크에 연결된 다른 컴퓨터에서 위 URL로 접속하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTestPage;
