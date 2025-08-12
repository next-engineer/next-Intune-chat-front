import React from 'react';

const SimpleTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🎉 채팅 테스트 페이지
        </h1>
        <p className="text-gray-700 mb-4">
          라우팅이 정상적으로 작동하고 있습니다!
        </p>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="font-semibold text-green-800 mb-2">테스트 성공!</h2>
          <ul className="text-green-700 text-sm space-y-1">
            <li>✅ React 컴포넌트 렌더링</li>
            <li>✅ Tailwind CSS 스타일링</li>
            <li>✅ React Router 라우팅</li>
            <li>✅ TypeScript 컴파일</li>
          </ul>
        </div>
        <div className="mt-6">
          <a 
            href="/" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage; 