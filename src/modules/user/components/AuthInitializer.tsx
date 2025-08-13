import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { initializeTheme, setupThemeListener } from '../stores/themeStore';

/**
 * 앱 초기화 컴포넌트
 * - 앱 시작 시 쿠키에서 인증 상태를 확인하고 초기화합니다.
 * - 테마 설정을 초기화합니다.
 * - 자식 컴포넌트들을 렌더링합니다.
 */
interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const initializeFromCookies = useAuthStore((state) => state.initializeFromCookies);
  const themeInitialized = useRef(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기화
    initializeFromCookies();
    
    // 테마는 한 번만 초기화
    if (!themeInitialized.current) {
      initializeTheme();
      themeInitialized.current = true;
    }
    
    // 시스템 테마 변경 감지 설정
    const cleanup = setupThemeListener();
    
    // 클린업 함수 반환
    return cleanup;
  }, [initializeFromCookies]);

  return <>{children}</>;
};

export default AuthInitializer;
