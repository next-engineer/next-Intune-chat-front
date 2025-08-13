import React, { useState, useEffect } from 'react';
import { ChatRoom, ChatMessage, ChatMember, MessageType, MessageStatus } from '../../types/chat.types';

const ChatTestPage: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('text');

  // 테스트용 더미 데이터 생성
  useEffect(() => {
    const dummyRooms: ChatRoom[] = [
      {
        id: '1',
        name: '개인 채팅방',
        description: '1:1 개인 대화',
        type: 'private',
        createdBy: 'user1',
        createdAt: new Date(),
        memberCount: 2,
        avatarUrl: 'https://via.placeholder.com/50',
        isPrivate: true,
        isActive: true,
      },
      {
        id: '2',
        name: '팀 프로젝트',
        description: '프로젝트 팀 채팅',
        type: 'team',
        createdBy: 'user1',
        createdAt: new Date(),
        memberCount: 5,
        maxMembers: 10,
        avatarUrl: 'https://via.placeholder.com/50',
        isPrivate: false,
        isActive: true,
      },
      {
        id: '3',
        name: '공개 채널',
        description: '모든 사용자 참여 가능',
        type: 'public',
        createdBy: 'admin',
        createdAt: new Date(),
        memberCount: 15,
        avatarUrl: 'https://via.placeholder.com/50',
        isPrivate: false,
        isActive: true,
      },
    ];

    const dummyMembers: ChatMember[] = [
      {
        userId: 'user1',
        username: '김철수',
        avatarUrl: 'https://via.placeholder.com/40',
        role: 'admin',
        joinedAt: new Date(),
        isOnline: true,
        isDnd: false,
      },
      {
        userId: 'user2',
        username: '이영희',
        avatarUrl: 'https://via.placeholder.com/40',
        role: 'member',
        joinedAt: new Date(),
        isOnline: true,
        isDnd: false,
      },
      {
        userId: 'user3',
        username: '박민수',
        avatarUrl: 'https://via.placeholder.com/40',
        role: 'member',
        joinedAt: new Date(),
        isOnline: false,
        isDnd: false,
      },
    ];

    const dummyMessages: ChatMessage[] = [
      {
        id: '1',
        roomId: '1',
        senderId: 'user1',
        senderName: '김철수',
        senderAvatar: 'https://via.placeholder.com/40',
        content: '안녕하세요!',
        type: 'text',
        status: 'read',
        timestamp: new Date(Date.now() - 60000),
        isRead: true,
        readBy: ['user1', 'user2'],
      },
      {
        id: '2',
        roomId: '1',
        senderId: 'user2',
        senderName: '이영희',
        senderAvatar: 'https://via.placeholder.com/40',
        content: '반갑습니다!',
        type: 'text',
        status: 'read',
        timestamp: new Date(Date.now() - 30000),
        isRead: true,
        readBy: ['user1', 'user2'],
      },
      {
        id: '3',
        roomId: '1',
        senderId: 'user1',
        senderName: '김철수',
        senderAvatar: 'https://via.placeholder.com/40',
        content: '오늘 날씨가 좋네요',
        type: 'text',
        status: 'sent',
        timestamp: new Date(),
        isRead: false,
        readBy: ['user1'],
      },
    ];

    setRooms(dummyRooms);
    setMembers(dummyMembers);
    setMessages(dummyMessages);
    setSelectedRoom(dummyRooms[0]);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      roomId: selectedRoom.id,
      senderId: 'user1',
      senderName: '김철수',
      senderAvatar: 'https://via.placeholder.com/40',
      content: newMessage,
      type: messageType,
      status: 'sending',
      timestamp: new Date(),
      isRead: false,
      readBy: ['user1'],
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // 시뮬레이션: 메시지 전송 상태 업데이트
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id 
            ? { ...msg, status: 'sent' as MessageStatus }
            : msg
        )
      );
    }, 1000);
  };

  const getRoomMessages = (roomId: string) => {
    return messages.filter(msg => msg.roomId === roomId);
  };

  const getStatusColor = (status: MessageStatus) => {
    switch (status) {
      case 'sending': return 'text-gray-400';
      case 'sent': return 'text-blue-500';
      case 'delivered': return 'text-green-500';
      case 'read': return 'text-green-600';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'file': return '📎';
      case 'system': return '🔔';
      case 'bot': return '🤖';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          채팅 시스템 테스트
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 채팅방 목록 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">채팅방 목록</h2>
            <div className="space-y-2">
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={room.avatarUrl}
                      alt={room.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {room.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          room.type === 'private' ? 'bg-purple-100 text-purple-800' :
                          room.type === 'team' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {room.type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {room.memberCount}명
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 채팅 메시지 영역 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col h-96">
            {selectedRoom ? (
              <>
                {/* 채팅방 헤더 */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedRoom.avatarUrl}
                        alt={selectedRoom.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedRoom.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedRoom.memberCount}명 참여 중
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedRoom.type === 'private' ? 'bg-purple-100 text-purple-800' :
                        selectedRoom.type === 'team' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedRoom.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 메시지 목록 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getRoomMessages(selectedRoom.id).map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${
                        message.senderId === 'user1' ? 'order-2' : 'order-1'
                      }`}>
                        <div className={`flex items-end space-x-2 ${
                          message.senderId === 'user1' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          {message.senderId !== 'user1' && (
                            <img
                              src={message.senderAvatar}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div className={`px-4 py-2 rounded-lg ${
                            message.senderId === 'user1'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(message.type)}
                              <span className="text-sm">{message.content}</span>
                            </div>
                            <div className={`flex items-center justify-between mt-1 ${
                              message.senderId === 'user1' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span className="text-xs">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {message.senderId === 'user1' && (
                                <span className={`text-xs ${getStatusColor(message.status)}`}>
                                  {message.status === 'sending' && '전송 중...'}
                                  {message.status === 'sent' && '✓'}
                                  {message.status === 'delivered' && '✓✓'}
                                  {message.status === 'read' && '✓✓'}
                                  {message.status === 'failed' && '✗'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {message.senderId !== 'user1' && (
                          <p className="text-xs text-gray-500 mt-1 ml-10">
                            {message.senderName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 메시지 입력 */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <select
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value as MessageType)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="text">텍스트</option>
                      <option value="image">이미지</option>
                      <option value="file">파일</option>
                      <option value="system">시스템</option>
                      <option value="bot">봇</option>
                    </select>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      전송
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                채팅방을 선택해주세요
              </div>
            )}
          </div>

          {/* 멤버 목록 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">멤버 목록</h2>
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.userId} className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={member.avatarUrl}
                      alt={member.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{member.username}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.role === 'admin' ? 'bg-red-100 text-red-800' :
                        member.role === 'member' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role}
                      </span>
                      {member.isDnd && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          방해금지
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 테스트 정보 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">테스트 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">채팅방 타입</h3>
              <p className="text-sm text-blue-700 mt-1">
                개인, 그룹, 공개, 팀 채팅방 구분
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">메시지 타입</h3>
              <p className="text-sm text-green-700 mt-1">
                텍스트, 이미지, 파일, 시스템, 봇 메시지
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">메시지 상태</h3>
              <p className="text-sm text-purple-700 mt-1">
                전송 중, 전송 완료, 전달됨, 읽음, 실패
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900">사용자 역할</h3>
              <p className="text-sm text-yellow-700 mt-1">
                관리자, 멤버, 게스트 권한 구분
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTestPage; 