import React from 'react';
import { config } from '../constants/config';

// 환경 변수 설정을 확인하는 디버그 컴포넌트
const ConfigDisplay: React.FC = () => {
  // 개발 모드에서만 표시
  if (!config.DEV_MODE) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🌍 환경 설정 정보</h3>
      <div className="space-y-1">
        <div>
          <span className="text-gray-300">API URL:</span>
          <span className="ml-2 text-green-400">{config.API_URL}</span>
        </div>
        <div>
          <span className="text-gray-300">WebSocket URL:</span>
          <span className="ml-2 text-blue-400">{config.WEBSOCKET_URL}</span>
        </div>
        <div>
          <span className="text-gray-300">앱 이름:</span>
          <span className="ml-2">{config.APP_NAME}</span>
        </div>
        <div>
          <span className="text-gray-300">버전:</span>
          <span className="ml-2">{config.APP_VERSION}</span>
        </div>
        <div>
          <span className="text-gray-300">AWS 리전:</span>
          <span className="ml-2">{config.AWS_REGION}</span>
        </div>
        <div className="pt-2 border-t border-gray-600">
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-xs ${config.ENABLE_CHAT ? 'bg-green-600' : 'bg-red-600'}`}>
              채팅: {config.ENABLE_CHAT ? 'ON' : 'OFF'}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${config.ENABLE_NOTION ? 'bg-green-600' : 'bg-red-600'}`}>
              Notion: {config.ENABLE_NOTION ? 'ON' : 'OFF'}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${config.ENABLE_PINGPONG ? 'bg-green-600' : 'bg-red-600'}`}>
              PingPong: {config.ENABLE_PINGPONG ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigDisplay;
