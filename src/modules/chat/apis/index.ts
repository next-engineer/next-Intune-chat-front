/**
 * Chat API 모듈
 * - 서버가 UTF-8 문자열(ISO8601 또는 epoch 문자열/숫자)로 내려주는 타임스탬프를
 *   프론트에서 Date 객체로 변환해 일관되게 사용합니다.
 * - 목록/상세/전송 응답 모두 공통 매핑 함수를 통해 정규화합니다.
 */
import axiosInstance from '../../../commons/apis/axiosInstance.api';
import { API_ENDPOINTS } from '../../../constants/endPoint.constants';
import { ApiErrorHandler } from '../../../commons/apis/error.api';

/**
 * 채팅 메시지 DTO (API 계층에서 사용하는 정규화된 형태)
 * - `timestamp`는 문자열/숫자 입력을 받아 Date로 변환됩니다.
 */
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
}

export const chatApi = {
  /**
   * 채팅방 목록 조회
   * - 서버 응답을 `mapChatRoom`으로 정규화합니다.
   */
  getChatList: async (): Promise<ChatRoom[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CHAT.LIST);
      const rooms: any[] = response.data || [];
      return rooms.map(mapChatRoom);
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  /**
   * 채팅방 상세 및 메시지 목록 조회
   * - `room`과 `messages`를 각 매핑 함수로 정규화합니다.
   */
  getChatRoom: async (roomId: string): Promise<{ room: ChatRoom; messages: ChatMessage[] }> => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.CHAT.ROOM}/${roomId}`);
      const data = response.data || {};
      const room = mapChatRoom(data.room);
      const messages = Array.isArray(data.messages) ? data.messages.map(mapChatMessage) : [];
      return { room, messages };
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  /**
   * 메시지 전송
   * - 서버 응답 메시지를 `mapChatMessage`로 정규화합니다.
   */
  sendMessage: async (data: SendMessageRequest): Promise<ChatMessage> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, data);
      return mapChatMessage(response.data);
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
}; 

// 내부 유틸: UTF-8 문자열(ISO8601 또는 UNIX epoch 문자열/숫자)를 Date로 변환
/**
 * UTF-8 문자열(ISO8601 또는 epoch 문자열/숫자)을 Date로 변환합니다.
 * - 10자리 숫자 문자열은 초 단위 epoch로 간주해 ms로 변환합니다.
 * - 13자리 숫자 문자열은 ms 단위 epoch로 간주합니다.
 */
function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    // epoch 숫자 문자열 지원
    const trimmed = value.trim();
    if (/^\d{10,}$/.test(trimmed)) {
      // 초 단위(10자리) 또는 밀리초(13자리) 대응
      const num = Number(trimmed);
      const ms = trimmed.length === 10 ? num * 1000 : num;
      return new Date(ms);
    }
    return new Date(trimmed);
  }
  // 알 수 없는 타입은 현재시각으로 폴백
  return new Date();
}

/**
 * 서버 응답 메시지를 정규화하여 ChatMessage로 변환합니다.
 */
function mapChatMessage(raw: any): ChatMessage {
  return {
    id: String(raw?.id ?? ''),
    content: String(raw?.content ?? ''),
    senderId: String(raw?.senderId ?? ''),
    senderName: String(raw?.senderName ?? ''),
    timestamp: toDate(raw?.timestamp),
  };
}

/**
 * 서버 응답 채팅방 정보를 정규화하여 ChatRoom으로 변환합니다.
 */
function mapChatRoom(raw: any): ChatRoom {
  const base: ChatRoom = {
    id: String(raw?.id ?? ''),
    name: String(raw?.name ?? ''),
    participants: Array.isArray(raw?.participants) ? raw.participants.map(String) : [],
    unreadCount: Number(raw?.unreadCount ?? 0),
  };

  if (raw?.lastMessage) {
    base.lastMessage = mapChatMessage(raw.lastMessage);
  }

  return base;
}