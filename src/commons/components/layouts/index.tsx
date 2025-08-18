/**
 * 페이지 레이아웃 공통 컴포넌트
 * - 상단 헤더(타이틀, 사용자 정보, 내비게이션), 본문, 하단 푸터를 제공합니다.
 * - 인증 상태에 따라 사용자 정보와 내비게이션을 표시합니다.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';

/**
 * 레이아웃 컴포넌트 Props
 * @property children - 본문 콘텐츠
 * @property title - 페이지 타이틀 (기본값: 'Intune Front')
 */
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Intune Front' }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  /**
   * 로그아웃 처리
   * - 인증 스토어 초기화 후 로그인 페이지로 이동합니다.
   */
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <h1>{title}</h1>
          {isAuthenticated && user && (
            <div className="user-info">
              <span>Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
        {/* 인증 시 내비게이션 표시 */}
        {isAuthenticated && (
          <nav className="layout-nav">
            <Link to="/chat/list">Chat List</Link>
            <Link to="/user/match">Find Match</Link>
          </nav>
        )}
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>&copy; 2024 Intune Front. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout; 