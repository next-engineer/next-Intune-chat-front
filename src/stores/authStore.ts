/**
 * 인증 상태 전역 스토어 (Zustand)
 * - 사용자 정보, 인증 상태, 토큰을 관리합니다.
 * - 쿠키 기반 인증을 지원합니다.
 * - `persist` 미들웨어로 선택 필드를 로컬 스토리지에 저장합니다.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getAccessTokenFromCookie,
  clearAuthCookies,
  isLoggedInFromCookies,
} from "../commons/utils/cookieUtils";


/**
 * 인증 스토어 상태/액션 타입
 * - `setUser`: 로그인 성공 시 사용자/토큰 설정 및 인증 플래그 on
 * - `logout`: 사용자/토큰 해제 및 인증 플래그 off
 * - `initializeFromCookies`: 쿠키에서 인증 상태 초기화
 */
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isAdmin: boolean;
  setAuthenticated: (user?: any) => void;
  setUser: (user: any) => void;
  logout: () => void;
  initializeFromCookies: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isAdmin: false,

      // 로그인 성공 시 상태 업데이트 및 쿠키 설정
      setAuthenticated: async (user?: any) => {
        set({
          isAuthenticated: true,
          user: user || null,
          isAdmin: user?.isAdmin || false,
        });
      },

      // 사용자 정보 설정
      setUser: (user: any) => {
        set({
          user,
          isAdmin: user?.isAdmin || false,
        });
      },

      // 로그아웃 시 상태 초기화 및 쿠키 삭제
      logout: () => {
        // 쿠키 삭제
        clearAuthCookies();

        // Zustand 상태 초기화
        set({
          isAuthenticated: false,
          user: null,
          isAdmin: false,
        });
      },

      // 쿠키에서 인증 상태 초기화
      initializeFromCookies: () => {
        const token = getAccessTokenFromCookie();
        const storedUser = localStorage.getItem('user');

        if (token && isLoggedInFromCookies() && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({
              isAuthenticated: true,
              user: user,
              isAdmin: user?.isAdmin || false,
            });
          } catch (error) {
            set({
              isAuthenticated: false,
              user: null,
              isAdmin: false,
            });
          }
        } else {
          // 쿠키가 유효하지 않으면 상태 초기화
          set({
            isAuthenticated: false,
            user: null,
            isAdmin: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      // 로컬 스토리지에 저장할 필드만 선별
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
