import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCookie, getCookie, deleteCookie } from '../commons/utils/utils/cookieUtils';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  resetToLightMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false, // 기본값을 false로 설정
      
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

      resetToLightMode: () => {
        set({ isDarkMode: false });
        
        // 기존 테마 쿠키 삭제
        deleteCookie('intune_theme');
        
        // 라이트모드 쿠키 설정
        setCookie('intune_theme', 'light', {
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년
          secure: true,
          sameSite: 'Lax'
        });
        
        // HTML 클래스 업데이트
        updateHtmlClass(false);
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
  
  if (themeCookie === 'dark') {
    // 쿠키에 다크모드가 명시적으로 설정된 경우에만 다크모드 적용
    useThemeStore.getState().setDarkMode(true);
  } else {
    // 그 외의 모든 경우 (쿠키가 없거나, light로 설정된 경우) 라이트모드 적용
    useThemeStore.getState().setDarkMode(false);
    
    // 쿠키가 없으면 라이트모드로 쿠키 설정
    if (!themeCookie) {
      setCookie('intune_theme', 'light', {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년
        secure: true,
        sameSite: 'Lax'
      });
    }
  }
  
  // HTML 클래스 업데이트
  updateHtmlClass(useThemeStore.getState().isDarkMode);
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
