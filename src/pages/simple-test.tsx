import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { getAllCookies, isLoggedInFromCookies, clearAuthCookies } from '../commons/utils/utils/cookieUtils';

const SimpleTestPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const [cookieLoginStatus, setCookieLoginStatus] = useState<boolean>(false);

  useEffect(() => {
    // 쿠키 상태 업데이트
    updateCookieStatus();
  }, []);

  const updateCookieStatus = () => {
    setCookies(getAllCookies());
    setCookieLoginStatus(isLoggedInFromCookies());
  };

  const handleClearCookies = () => {
    clearAuthCookies();
    logout();
    updateCookieStatus();
  };

  const handleRefresh = () => {
    updateCookieStatus();
  };

  return (
    <div className="min-h-screen bg-blue-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          🎉 쿠키 기반 인증 & 다크모드 테스트
        </h1>
        
        <div className="space-y-6">
          {/* Zustand 상태 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Zustand 인증 상태</h2>
            <div className="space-y-2 text-sm">
              <p><strong>로그인 상태:</strong> {isAuthenticated ? '✅ 로그인됨' : '❌ 로그아웃됨'}</p>
              {user && (
                <div>
                  <p><strong>사용자 ID:</strong> {user.id}</p>
                  <p><strong>사용자 이름:</strong> {user.name}</p>
                  <p><strong>이메일:</strong> {user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* 테마 상태 */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h2 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">테마 상태</h2>
            <div className="space-y-2 text-sm">
              <p><strong>다크모드:</strong> {isDarkMode ? '🌙 활성화' : '☀️ 비활성화'}</p>
              <button
                onClick={toggleDarkMode}
                className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
              >
                테마 변경
              </button>
            </div>
          </div>

          {/* 쿠키 상태 */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800 dark:text-green-200 mb-2">쿠키 인증 상태</h2>
            <div className="space-y-2 text-sm">
              <p><strong>쿠키 로그인 상태:</strong> {cookieLoginStatus ? '✅ 로그인됨' : '❌ 로그아웃됨'}</p>
            </div>
          </div>

          {/* 모든 쿠키 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">모든 쿠키</h2>
            {Object.keys(cookies).length > 0 ? (
              <div className="space-y-1 text-sm">
                {Object.entries(cookies).map(([name, value]) => (
                  <div key={name} className="flex justify-between">
                    <span className="font-mono text-gray-600 dark:text-gray-300">{name}:</span>
                    <span className="font-mono text-gray-800 dark:text-gray-100">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">쿠키가 없습니다.</p>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              쿠키 상태 새로고침
            </button>
            
            <button 
              onClick={handleClearCookies}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              모든 쿠키 삭제
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              {isDarkMode ? '☀️ 라이트모드' : '🌙 다크모드'}
            </button>
            
            <a 
              href="/" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              홈으로 돌아가기
            </a>
          </div>

          {/* 테스트 성공 메시지 */}
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ 테스트 성공!</h2>
            <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
              <li>✅ React 컴포넌트 렌더링</li>
              <li>✅ Tailwind CSS 스타일링</li>
              <li>✅ React Router 라우팅</li>
              <li>✅ TypeScript 컴파일</li>
              <li>✅ Zustand 상태 관리</li>
              <li>✅ 쿠키 기반 인증</li>
              <li>✅ 쿠키 상태 감지</li>
              <li>✅ 다크모드 지원</li>
              <li>✅ 테마 상태 관리</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage;
