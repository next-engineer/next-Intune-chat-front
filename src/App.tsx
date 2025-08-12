/**
 * 애플리케이션 루트 라우터 구성
 * - 전역 라우팅 엔트리포인트로, 페이지 컴포넌트를 경로에 매핑합니다.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/home';
import SimpleTestPage from './pages/chat/simple-test';

/**
 * App 컴포넌트
 * - 라우터 컨테이너 및 라우트 정의를 렌더링합니다.
 */
function App() {
  return (
    <Router basename="/">
      <div className="App">
        {/* 주요 라우트 매핑 */}
        <Routes>
          {/* 홈 페이지 (루트) */}
          <Route path="/" element={<HomePage />} />
          {/* 샘플 채팅 테스트 페이지 */}
          <Route path="/simple-test" element={<SimpleTestPage />} />
          {/* 홈 페이지 (별칭 경로) */}
          <Route path="/home" element={<HomePage />} />
          {/* 404 페이지 - 모든 경로에 대해 홈페이지로 리다이렉트 */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 