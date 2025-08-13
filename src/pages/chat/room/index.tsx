/**
 * 채팅방 상세 페이지
 * - 경로 파라미터로 전달된 `roomId`의 채팅방을 렌더링합니다.
 * - 상단 버튼으로 목록으로 이동할 수 있습니다.
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Phone, Video, Search, Send, Smile, Paperclip } from 'lucide-react';
import Chat from '../../../modules/chat/components/chat';
import { MainLayout } from '../../../commons/components/layout/MainLayout';

const ChatRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // roomId 누락 시 가드 처리
  if (!roomId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">채팅방 오류</h1>
            <p className="text-gray-600 mb-4">채팅방 ID가 필요합니다.</p>
            <button 
              onClick={() => navigate('/chat/list')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              채팅 목록으로 돌아가기
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  /** 채팅방 목록으로 이동 */
  const handleBackToChatList = () => {
    navigate('/chat/list');
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* 채팅방 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* 뒤로가기 버튼과 채팅방 정보 */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBackToChatList}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="뒤로가기"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* 채팅방 정보 */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {roomId.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">채팅방 {roomId}</h1>
                  <p className="text-sm text-gray-500">온라인</p>
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Video className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-hidden">
          <Chat roomId={roomId} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatRoomPage; 