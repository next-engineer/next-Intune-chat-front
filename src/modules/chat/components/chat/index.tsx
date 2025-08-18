

/**
 * 채팅방 메시지 렌더링 컴포넌트
 * - 현재 로그인한 사용자(`useAuthStore().user.id`)와 `message.senderId`를 비교해
 *   내 메시지는 우측/파랑, 상대 메시지는 좌측/회색으로 구분합니다.
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { chatApi, ChatMessage, ChatRoom } from '../../apis';
import { useAuthStore } from '../../../../stores/authStore';
import { Send, Smile, Paperclip, Image, File, Mic, MoreVertical } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

/**
 * 채팅방 컴포넌트 Props
 * @property roomId - 채팅방 고유 ID
 */
interface ChatProps {
  roomId: string;
}

// 메모이제이션된 메시지 컴포넌트
const MessageItem = React.memo<{
  message: ChatMessage;
  isOwnMessage: boolean;
  showAvatar: boolean;
}>(({ message, isOwnMessage, showAvatar }) => (
  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 group`}>
    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* 아바타 */}
      {showAvatar && !isOwnMessage && (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-medium">
            {message.senderName?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      )}
      
      {/* 메시지 버블 */}
      <div className={`relative px-4 py-2 rounded-2xl shadow-sm ${
        isOwnMessage 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
          : 'bg-white text-gray-800 border border-gray-200'
      }`}>
        {/* 메시지 내용 */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
        
        {/* 이미지 표시 */}
        {message.imageUrl && (
          <div className="mt-2">
            <img 
              src={message.imageUrl} 
              alt="채팅 이미지" 
              className="max-w-xs rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.imageUrl, '_blank')}
            />
          </div>
        )}
        
        {/* 시간 */}
        <div className={`text-xs mt-1 ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
        
        {/* 메시지 상태 (내 메시지인 경우) */}
        {isOwnMessage && (
          <div className="absolute -bottom-1 -right-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
));

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 현재 로그인 사용자 ID. 내 메시지 구분(정렬/스타일)에 사용됩니다.
  const currentUserId = useAuthStore((state) => state.user?.id);

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메모이제이션된 채팅방 로딩 함수
  const loadChatRoom = useCallback(async () => {
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
  }, [roomId]);

  // 메모이제이션된 메시지 전송 함수
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;

    try {
      // 이미지가 있는 경우 이미지 메시지 전송
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('roomId', roomId);
        if (newMessage.trim()) {
          formData.append('content', newMessage);
        }

        // 실제 API 호출 대신 모의 이미지 메시지 생성
        const imageMessage: ChatMessage = {
          id: `img_${Date.now()}`,
          senderId: currentUserId!,
          senderName: useAuthStore.getState().user?.name || '나',
          content: newMessage.trim() || '이미지를 보냈습니다.',
          imageUrl: imagePreview, // 실제로는 서버에서 받은 URL
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, imageMessage]);
        setSelectedImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        // 텍스트 메시지 전송
        const message = await chatApi.sendMessage({
          roomId,
          content: newMessage,
        });
        setMessages(prev => [...prev, message]);
      }

      setNewMessage('');
      scrollToBottom();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    }
  }, [newMessage, selectedImage, roomId, currentUserId, imagePreview]);

  // 메모이제이션된 입력 변경 핸들러
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  }, []);

  // 이모지 선택 핸들러
  const handleEmojiClick = useCallback((emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  }, []);

  // 이미지 파일 선택 핸들러
  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (10MB 이하)
    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert("JPG, PNG, GIF 형식의 이미지만 업로드할 수 있습니다.");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  // 이미지 제거 핸들러
  const handleImageRemove = useCallback(() => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // 메모이제이션된 메시지 목록
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages]);

  // 메모이제이션된 메시지 그룹화
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    sortedMessages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  }, [sortedMessages]);

  useEffect(() => {
    // roomId 변경 시 채팅방 정보/메시지 재로딩
    loadChatRoom();
  }, [loadChatRoom]);

  useEffect(() => {
    // 새 메시지가 추가되면 스크롤을 맨 아래로
    scrollToBottom();
  }, [messages]);

  // 이모지 피커 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.emoji-picker-container') && !target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">채팅방을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오류가 발생했습니다</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadChatRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* 날짜 구분선 */}
            <div className="text-center my-4">
              <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                {new Date(date).toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            {/* 해당 날짜의 메시지들 */}
            {dayMessages.map((message, index) => {
              const prevMessage = dayMessages[index - 1];
              const showAvatar = !prevMessage || 
                prevMessage.senderId !== message.senderId ||
                new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 300000; // 5분

              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.senderId === currentUserId}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        ))}
        
        {/* 타이핑 표시 */}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">U</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 이미지 미리보기 */}
      {imagePreview && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="미리보기" 
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">이미지가 선택되었습니다</p>
              <p className="text-xs text-gray-400">클릭하여 제거할 수 있습니다</p>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 입력 폼 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          {/* 첨부 파일 버튼 */}
          <div className="flex space-x-1">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Image className="h-5 w-5" />
              </button>
            </label>
          </div>

          {/* 메시지 입력창 */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="메시지를 입력하세요..."
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors emoji-button"
            >
              <Smile className="h-5 w-5" />
            </button>
            
            {/* 이모지 피커 */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50 emoji-picker-container">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={350}
                  height={400}
                  searchPlaceholder="이모지 검색..."
                  lazyLoadEmojis={true}
                />
              </div>
            )}
          </div>

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={!newMessage.trim() && !selectedImage}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(Chat); 