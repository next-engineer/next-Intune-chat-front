/**
 * 인증 상태 전역 스토어 (Zustand)
 * - 사용자 정보, 인증 상태, 토큰을 관리합니다.
 * - 쿠키 기반 인증을 지원합니다.
 * - `persist` 미들웨어로 선택 필드를 로컬 스토리지에 저장합니다.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  setAuthCookies, 
  setUserCookies, 
  getUserFromCookies, 
  getAccessTokenFromCookie,
  clearAuthCookies,
  isLoggedInFromCookies
} from '../commons/utils/cookieUtils';

/** 사용자 정보 타입 */
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
}

/**
 * 인증 스토어 상태/액션 타입
 * - `setUser`: 로그인 성공 시 사용자/토큰 설정 및 인증 플래그 on
 * - `logout`: 사용자/토큰 해제 및 인증 플래그 off
 * - `initializeFromCookies`: 쿠키에서 인증 상태 초기화
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isAdmin: boolean;
  setUser: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  initializeFromCookies: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isAdmin: false,
      
      // 로그인 성공 시 상태 업데이트 및 쿠키 설정
      setUser: async (user: User, token: string, refreshToken?: string) => {
        // 쿠키에 인증 정보 저장 (해시된 토큰)
        await setAuthCookies(token, refreshToken);
        setUserCookies(user);
        
        // Zustand 상태 업데이트
        set({
          user,
          isAuthenticated: true,
          token,
          isAdmin: user.isAdmin || user.email === 'admin@intune.com',
        });
      },
      
      // 로그아웃 시 상태 초기화 및 쿠키 삭제
      logout: () => {
        // 쿠키 삭제
        clearAuthCookies();
        
        // Zustand 상태 초기화
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isAdmin: false,
        });
      },
      
      // 쿠키에서 인증 상태 초기화
      initializeFromCookies: () => {
        const user = getUserFromCookies();
        const token = getAccessTokenFromCookie();
        
        if (user && token && isLoggedInFromCookies()) {
          set({
            user,
            isAuthenticated: true,
            token,
            isAdmin: user.isAdmin || user.email === 'admin@intune.com',
          });
        } else {
          // 쿠키가 유효하지 않으면 상태 초기화
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            isAdmin: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      // 로컬 스토리지에 저장할 필드만 선별
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        isAdmin: state.isAdmin,
      }),
    }
  )
); 