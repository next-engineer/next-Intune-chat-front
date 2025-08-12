/**
 * 인증 상태 전역 스토어 (Zustand)
 * - 사용자 정보, 인증 상태, 토큰을 관리합니다.
 * - `persist` 미들웨어로 선택 필드를 로컬 스토리지에 저장합니다.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 사용자 정보 타입 */
interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * 인증 스토어 상태/액션 타입
 * - `setUser`: 로그인 성공 시 사용자/토큰 설정 및 인증 플래그 on
 * - `logout`: 사용자/토큰 해제 및 인증 플래그 off
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      // 로그인 성공 시 상태 업데이트
      setUser: (user: User, token: string) =>
        set({
          user,
          isAuthenticated: true,
          token,
        }),
      // 로그아웃 시 상태 초기화
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        }),
    }),
    {
      name: 'auth-storage',
      // 로컬 스토리지에 저장할 필드만 선별
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
); 