import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCookie, getCookie, deleteCookie } from '../commons/utils/cookieUtils';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      
      toggleDarkMode: () => {
        const newDarkMode = !get().isDarkMode;
        set({ isDarkMode: newDarkMode });
        
        // 쿠키에 테마 설정 저장
        if (newDarkMode) {
          setCookie('intune_theme', 'dark', {
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년
            secure: true,
            sameSite: 'Lax'
          });
        } else {
          setCookie('intune_theme', 'light', {
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년
            secure: true,
            sameSite: 'Lax'
          });
        }
        
        // HTML 클래스 업데이트
        updateHtmlClass(newDarkMode);
      },
      
      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
        
        // 쿠키에 테마 설정 저장
        const themeValue = isDark ? 'dark' : 'light';
        setCookie('intune_theme', themeValue, {
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년
          secure: true,
          sameSite: 'Lax'
        });
        
        // HTML 클래스 업데이트
        updateHtmlClass(isDark);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// HTML 클래스 업데이트 함수
const updateHtmlClass = (isDark: boolean) => {
  const html = document.documentElement;
  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

// 초기 테마 설정 함수
export const initializeTheme = () => {
  // 쿠키에서 테마 설정 확인
  const themeCookie = getCookie('intune_theme');
  const isDarkFromCookie = themeCookie === 'dark';
  
  // 시스템 다크모드 감지
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 우선순위: 쿠키 > 시스템 설정 > 기본값(라이트)
  const shouldBeDark = themeCookie ? isDarkFromCookie : systemPrefersDark;
  
  // 스토어 업데이트 (HTML 클래스는 setDarkMode에서 처리됨)
  useThemeStore.getState().setDarkMode(shouldBeDark);
};

// 시스템 테마 변경 감지
export const setupThemeListener = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    // 쿠키가 설정되지 않은 경우에만 시스템 설정을 따름
    const themeCookie = getCookie('intune_theme');
    if (!themeCookie) {
      useThemeStore.getState().setDarkMode(e.matches);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // 클린업 함수 반환
  return () => mediaQuery.removeEventListener('change', handleChange);
};
