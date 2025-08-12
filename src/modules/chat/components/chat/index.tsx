/**
 * 채팅방 메시지 렌더링 컴포넌트
 * - 현재 로그인한 사용자(`useAuthStore().user.id`)와 `message.senderId`를 비교해
 *   내 메시지는 우측/파랑, 상대 메시지는 좌측/회색으로 구분합니다.
 */
import React, { useState, useEffect } from 'react';
import { chatApi, ChatMessage, ChatRoom } from '../../apis';
import { useAuthStore } from '../../../../stores/authStore';

/**
 * 채팅방 컴포넌트 Props
 * @property roomId - 채팅방 고유 ID
 */
interface ChatProps {
  roomId: string;
}

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  // 현재 로그인 사용자 ID. 내 메시지 구분(정렬/스타일)에 사용됩니다.
  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    // roomId 변경 시 채팅방 정보/메시지 재로딩
    loadChatRoom();
  }, [roomId]);

  /**
   * 채팅방 상세 및 메시지 목록 로딩
   * - 실패 시 에러 메시지를 상태로 설정합니다.
   */
  const loadChatRoom = async () => {
    setLoading(true);
    try {
      const data = await chatApi.getChatRoom(roomId);
      setRoom(data.room);
      setMessages(data.messages);
    } catch (err: any) {
      setError(err.message || 'Failed to load chat room');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 메시지 전송 핸들러
   * - 공백 입력은 전송하지 않습니다.
   * - 성공 시 입력값 초기화 및 메시지 목록에 추가합니다.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await chatApi.sendMessage({
        roomId,
        content: newMessage,
      });
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    }
  };

  if (loading) {
    return <div>Loading chat room...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="chat-container">
      {room && (
        <div className="chat-header">
          <h3>{room.name}</h3>
        </div>
      )}
      
      {/* 메시지 목록: 내 메시지는 우측 정렬/파랑, 상대 메시지는 좌측 정렬/회색 */}
      <div className="messages-container space-y-2">
        {messages.map((message) => {
          const isMine = currentUserId ? message.senderId === currentUserId : false;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${isMine ? 'order-2' : 'order-1'}`}>
                <div
                  className={`flex items-end space-x-2 ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {!isMine && message.senderAvatar && (
                    <img
                      src={message.senderAvatar}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div
                      className={`flex items-center justify-between mt-1 ${
                        isMine ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      <span className="text-xs">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                {!isMine && (
                  <p className="text-xs text-gray-500 mt-1 ml-10">{message.senderName}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 