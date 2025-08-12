/**
 * 애플리케이션 루트 라우터 구성
 * - 전역 라우팅 엔트리포인트로, 페이지 컴포넌트를 경로에 매핑합니다.
 * - 코드 스플리팅을 통한 성능 최적화 적용
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthInitializer from './components/AuthInitializer';

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// 에러 컴포넌트
const ErrorFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">페이지 로드 오류</h1>
      <p className="text-gray-600 mb-4">페이지를 불러오는 중 오류가 발생했습니다.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        새로고침
      </button>
    </div>
  </div>
);

// 지연 로딩을 위한 페이지 컴포넌트들
const HomePage = lazy(() => import('./pages/home'));
const SimpleTestPage = lazy(() => import('./pages/chat/simple-test'));
const ChatTestPage = lazy(() => import('./pages/chat/test'));
const ChatListPage = lazy(() => import('./pages/chat/list'));
const ChatRoomPage = lazy(() => import('./pages/chat/room'));
const PingPongPage = lazy(() => import('./pages/pingpong'));
const NotionPage = lazy(() => import('./pages/notion'));
const SignInPage = lazy(() => import('./pages/user/signIn'));
const SignUpPage = lazy(() => import('./pages/user/signUp'));
const MatchPage = lazy(() => import('./pages/user/match'));

/**
 * App 컴포넌트
 * - 라우터 컨테이너 및 라우트 정의를 렌더링합니다.
 * - Suspense를 통한 로딩 상태 관리
 * - 쿠키 기반 인증 상태 초기화
 */
function App() {
  return (
    <AuthInitializer>
      <Router basename="/">
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            {/* 주요 라우트 매핑 */}
            <Routes>
              {/* 홈 페이지 (루트) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              
              {/* 채팅 관련 페이지 */}
              <Route path="/simple-test" element={<SimpleTestPage />} />
              <Route path="/chat/test" element={<ChatTestPage />} />
              <Route path="/chat/list" element={<ChatListPage />} />
              <Route path="/chat/room" element={<ChatRoomPage />} />
              <Route path="/chat/:roomId" element={<ChatRoomPage />} />
              
              {/* 핑퐁 기능 페이지 */}
              <Route path="/pingpong" element={<PingPongPage />} />
              
              {/* 노션 페이지 */}
              <Route path="/notion" element={<NotionPage />} />
              
              {/* 사용자 관련 페이지 */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/match" element={<MatchPage />} />
              <Route path="/matching" element={<MatchPage />} />
              
              {/* 404 페이지 - 모든 경로에 대해 홈페이지로 리다이렉트 */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthInitializer>
  );
}

export default App; 