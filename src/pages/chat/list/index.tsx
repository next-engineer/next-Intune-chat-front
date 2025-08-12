/**
 * 채팅방 목록 페이지
 * - 사용자가 참여 중인 채팅방 목록을 불러와 표시합니다.
 * - 항목 클릭 시 해당 채팅방 상세로 이동합니다.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi, ChatRoom } from '../../../modules/chat/apis';
import Layout from '../../../commons/components/layouts';

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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

  if (loading) {
    return (
      <Layout title="Chat Rooms">
        <div>Loading chat rooms...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Chat Rooms">
      <div className="chat-list-page">
        <div className="chat-list-header">
          <h2>Your Chat Rooms</h2>
          <button 
            onClick={handleFindMatch}
            className="find-match-button"
          >
            Find New Match
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {/* 채팅방 항목 리스트 */}
        <div className="chat-rooms">
          {chatRooms.length === 0 ? (
            <div className="no-chats">
              <p>No chat rooms yet. Find a match to start chatting!</p>
              <button 
                onClick={handleFindMatch}
                className="find-match-button"
              >
                Find Match
              </button>
            </div>
          ) : (
            chatRooms.map((room) => (
              <div 
                key={room.id} 
                className="chat-room-item"
                onClick={() => handleRoomClick(room.id)}
              >
                <div className="room-info">
                  <h3>{room.name}</h3>
                  {room.lastMessage && (
                    <p className="last-message">{room.lastMessage.content}</p>
                  )}
                </div>
                {room.unreadCount > 0 && (
                  <div className="unread-badge">{room.unreadCount}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatListPage; 