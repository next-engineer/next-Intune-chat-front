/**
 * 채팅방 목록 페이지
 * - 사용자가 참여 중인 채팅방 목록을 불러와 표시합니다.
 * - 항목 클릭 시 해당 채팅방 상세로 이동합니다.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi, ChatRoom } from '../../../modules/chat/apis';
import { MainLayout } from '../../../commons/components/layout/MainLayout';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Users, 
  Clock, 
  MoreVertical,
  Heart
} from 'lucide-react';

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 최초 마운트 시 채팅방 목록 로딩
    loadChatRooms();
  }, []);

  /**
   * 채팅방 목록 조회
   * - 실패 시 사용자에게 에러 메시지를 표시합니다.
   */
  const loadChatRooms = async () => {
    try {
      const rooms = await chatApi.getChatList();
      setChatRooms(rooms);
    } catch (err: any) {
      setError(err.message || 'Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  /** 채팅방 클릭 시 상세 페이지로 이동 */
  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/room/${roomId}`);
  };

  /** 매칭 페이지로 이동 (새 채팅 생성 진입점) */
  const handleFindMatch = () => {
    navigate('/user/match');
  };

  /** 검색된 채팅방 필터링 */
  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** 시간 포맷팅 */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">채팅방을 불러오는 중...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">채팅</h1>
            <button
              onClick={handleFindMatch}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>새 매칭</span>
            </button>
          </div>
          
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="채팅방 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="text-red-500">⚠️</div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* 채팅방 목록 */}
        <div className="p-4 space-y-3">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <div>
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                  <p className="text-gray-500 mb-4">다른 검색어를 시도해보세요.</p>
                </div>
              ) : (
                <div>
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 채팅방이 없습니다</h3>
                  <p className="text-gray-500 mb-6">새로운 매칭을 찾아 대화를 시작해보세요!</p>
                  <button
                    onClick={handleFindMatch}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-5 w-5" />
                    <span>새 매칭 찾기</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  {/* 채팅방 아바타 */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {room.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* 채팅방 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
                      <div className="flex items-center space-x-2">
                        {room.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(room.lastMessage.timestamp)}
                          </span>
                        )}
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    {room.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {room.lastMessage.content}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{room.participants?.length || 0}명</span>
                      </div>
                      {room.unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {room.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatListPage; 