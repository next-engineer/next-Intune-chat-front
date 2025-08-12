import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Intune Chat</h1>
            </div>
            <nav className="flex space-x-8">
              <Link to="/signin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                로그인
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                회원가입
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">실시간 채팅으로</span>
            <span className="block text-blue-600">소통하세요</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            안전하고 빠른 실시간 채팅 플랫폼으로 새로운 친구를 만나고 소통해보세요.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                시작하기
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link to="/chat/test" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                데모 보기
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  💬
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">실시간 채팅</h3>
                <p className="mt-2 text-base text-gray-500">
                  WebSocket을 통한 빠르고 안정적인 실시간 메시지 전송
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  🔒
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">안전한 소통</h3>
                <p className="mt-2 text-base text-gray-500">
                  JWT 토큰 기반 인증으로 안전한 사용자 인증 시스템
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  👥
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">스마트 매칭</h3>
                <p className="mt-2 text-base text-gray-500">
                  AI 기반 매칭 시스템으로 나와 맞는 친구를 찾아보세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">빠른 링크</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link to="/chat/test" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">🧪</div>
              <div className="font-medium text-gray-900">채팅 테스트</div>
            </Link>
            <Link to="/chat/list" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium text-gray-900">채팅 목록</div>
            </Link>
            <Link to="/user/match" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-medium text-gray-900">매칭</div>
            </Link>
            <Link to="/pingpong" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">🏓</div>
              <div className="font-medium text-gray-900">연결 테스트</div>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,234</div>
              <div className="text-gray-500">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">5,678</div>
              <div className="text-gray-500">총 메시지</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-gray-500">업타임</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Intune Chat</h3>
              <p className="text-gray-300">
                실시간 채팅으로 새로운 친구를 만나고 소통하세요.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/chat/list" className="hover:text-white">채팅</Link></li>
                <li><Link to="/user/match" className="hover:text-white">매칭</Link></li>
                <li><Link to="/notion" className="hover:text-white">Notion 연동</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">개발</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/chat/test" className="hover:text-white">테스트</Link></li>
                <li><Link to="/pingpong" className="hover:text-white">연결 상태</Link></li>
                <li><Link to="/simple-test" className="hover:text-white">기본 테스트</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">계정</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/signin" className="hover:text-white">로그인</Link></li>
                <li><Link to="/signup" className="hover:text-white">회원가입</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; 2024 Intune Chat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 