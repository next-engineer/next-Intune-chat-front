import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  MessageCircle, 
  Users, 
  Settings, 
  User, 
  LogOut,
  Heart,
  Bell,
  HelpCircle,
  Info,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { Button } from '@/commons/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';

interface HamburgerMenuProps {
  user?: {
    name: string;
    avatar?: string;
  };
}

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  path: string;
  description: string;
  action?: () => void;
}

export function HamburgerMenu({ user }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: '홈',
      path: '/',
      description: '메인 페이지로 이동'
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: '매칭',
      path: '/match',
      description: '새로운 매칭 시작'
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: '채팅',
      path: '/chat/list',
      description: '채팅 목록 보기'
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: '핑퐁 테스트',
      path: '/pingpong',
      description: '연결 상태 테스트'
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: '알림',
      path: '/notifications',
      description: '알림 설정'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: '설정',
      path: '/settings',
      description: '앱 설정'
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: '도움말',
      path: '/help',
      description: '사용법 안내'
    },
    {
      icon: <Info className="h-5 w-5" />,
      label: '정보',
      path: '/about',
      description: '앱 정보'
    }
  ];

  const userMenuItems: MenuItem[] = [
    {
      icon: <User className="h-5 w-5" />,
      label: '프로필',
      path: '/profile',
      description: '내 정보 수정'
    },
    {
      icon: <LogOut className="h-5 w-5" />,
      label: '로그아웃',
      path: '/logout',
      description: '계정에서 로그아웃',
      action: () => {
        // 로그아웃 로직
        console.log('로그아웃');
        closeMenu();
      }
    }
  ];

  return (
    <div className="relative">
      {/* 햄버거 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="relative z-50"
        aria-label="메뉴 열기"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* 메뉴 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* 메뉴 패널 */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* 메뉴 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">메뉴</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMenu}
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 사용자 정보 */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">로그인됨</p>
              </div>
            </div>
          </div>
        )}

        {/* 메뉴 항목들 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {/* 메인 메뉴 */}
            <div className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                메인
              </h3>
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="text-gray-400 group-hover:text-primary transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* 테마 설정 */}
            <div className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                테마
              </h3>
              <div className="px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400">
                      {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">다크모드</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isDarkMode ? '어두운 테마 사용 중' : '밝은 테마 사용 중'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                    aria-label="다크모드 토글"
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 사용자 메뉴 */}
            {user && (
              <div className="mb-4">
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  계정
                </h3>
                {userMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 로그인/회원가입 (비로그인 상태) */}
            {!user && (
              <div className="mb-4">
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  계정
                </h3>
                <button
                  onClick={() => handleNavigation('/signin')}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="text-gray-400 group-hover:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">로그인</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">계정에 로그인</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="text-gray-400 group-hover:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">회원가입</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">새 계정 만들기</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 메뉴 푸터 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Intune Chat v0.1.0
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              © 2024 Intune Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
