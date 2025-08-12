/**
 * 채팅방 상세 페이지
 * - 경로 파라미터로 전달된 `roomId`의 채팅방을 렌더링합니다.
 * - 상단 버튼으로 목록으로 이동할 수 있습니다.
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from '../../../modules/chat/components/chat';
import Layout from '../../../commons/components/layouts';

const ChatRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // roomId 누락 시 가드 처리
  if (!roomId) {
    return (
      <Layout title="Chat Room">
        <div className="error">Room ID is required</div>
      </Layout>
    );
  }

  /** 채팅방 목록으로 이동 */
  const handleBackToChatList = () => {
    navigate('/chat/list');
  };

  return (
    <Layout title="Chat Room">
      <div className="chat-room-page">
        <div className="chat-room-header">
          <button 
            onClick={handleBackToChatList}
            className="back-button"
          >
            ← Back to Chat List
          </button>
        </div>
        <Chat roomId={roomId} />
      </div>
    </Layout>
  );
};

export default ChatRoomPage; 