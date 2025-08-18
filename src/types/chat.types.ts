/**
 * 채팅 시스템 타입 정의
 * 채팅방, 메시지, 사용자 관련 타입들을 포함합니다.
 */

/**
 * 채팅방 타입
 */
export type ChatRoomType = 'private' | 'group' | 'public' | 'team';

/**
 * 메시지 타입
 */
export type MessageType = 'text' | 'image' | 'file' | 'system' | 'bot';

/**
 * 메시지 상태
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * 사용자 역할
 */
export type UserRole = 'admin' | 'member' | 'guest';

/**
 * 채팅방 인터페이스
 */
export interface ChatRoom {
  /** 채팅방 고유 ID */
  id: string;
  /** 채팅방 이름 */
  name: string;
  /** 채팅방 설명 */
  description?: string;
  /** 채팅방 타입 */
  type: ChatRoomType;
  /** 채팅방 생성자 ID */
  createdBy: string;
  /** 채팅방 생성 시간 */
  createdAt: Date;
  /** 마지막 메시지 시간 */
  lastMessageAt?: Date;
  /** 참여자 수 */
  memberCount: number;
  /** 최대 참여자 수 (0은 무제한) */
  maxMembers?: number;
  /** 채팅방 이미지 URL */
  avatarUrl?: string;
  /** 비공개 채팅방 여부 */
  isPrivate: boolean;
  /** 채팅방 활성화 상태 */
  isActive: boolean;
}

/**
 * 채팅 메시지 인터페이스
 */
export interface ChatMessage {
  /** 메시지 고유 ID */
  id: string;
  /** 채팅방 ID */
  roomId: string;
  /** 발신자 ID */
  senderId: string;
  /** 발신자 이름 */
  senderName: string;
  /** 발신자 아바타 URL */
  senderAvatar?: string;
  /** 메시지 내용 */
  content: string;
  /** 메시지 타입 */
  type: MessageType;
  /** 메시지 상태 */
  status: MessageStatus;
  /** 전송 시간 */
  timestamp: Date;
  /** 수정 시간 */
  editedAt?: Date;
  /** 첨부 파일 정보 */
  attachments?: Attachment[];
  /** 답장 대상 메시지 ID */
  replyTo?: string;
  /** 메시지 읽음 여부 */
  isRead: boolean;
  /** 읽은 사용자 목록 */
  readBy: string[];
}

/**
 * 첨부 파일 인터페이스
 */
export interface Attachment {
  /** 파일 ID */
  id: string;
  /** 파일명 */
  name: string;
  /** 파일 타입 */
  type: string;
  /** 파일 크기 (bytes) */
  size: number;
  /** 파일 URL */
  url: string;
  /** 썸네일 URL (이미지인 경우) */
  thumbnailUrl?: string;
}

/**
 * 채팅방 멤버 인터페이스
 */
export interface ChatMember {
  /** 사용자 ID */
  userId: string;
  /** 사용자 이름 */
  username: string;
  /** 사용자 아바타 URL */
  avatarUrl?: string;
  /** 사용자 역할 */
  role: UserRole;
  /** 참여 시간 */
  joinedAt: Date;
  /** 마지막 활동 시간 */
  lastSeen?: Date;
  /** 온라인 상태 */
  isOnline: boolean;
  /** 방해 금지 모드 */
  isDnd: boolean;
}

/**
 * 채팅방 초대 인터페이스
 */
export interface ChatInvite {
  /** 초대 ID */
  id: string;
  /** 채팅방 ID */
  roomId: string;
  /** 초대한 사용자 ID */
  invitedBy: string;
  /** 초대받은 사용자 ID */
  invitedUserId: string;
  /** 초대 메시지 */
  message?: string;
  /** 초대 생성 시간 */
  createdAt: Date;
  /** 초대 만료 시간 */
  expiresAt: Date;
  /** 초대 상태 */
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

/**
 * 채팅 알림 설정 인터페이스
 */
export interface ChatNotificationSettings {
  /** 사용자 ID */
  userId: string;
  /** 채팅방 ID */
  roomId: string;
  /** 메시지 알림 활성화 */
  messageNotifications: boolean;
  /** 멘션 알림 활성화 */
  mentionNotifications: boolean;
  /** 시스템 메시지 알림 활성화 */
  systemNotifications: boolean;
  /** 소리 알림 활성화 */
  soundEnabled: boolean;
  /** 진동 알림 활성화 */
  vibrationEnabled: boolean;
}

/**
 * 채팅 검색 결과 인터페이스
 */
export interface ChatSearchResult {
  /** 검색된 메시지 */
  messages: ChatMessage[];
  /** 검색된 채팅방 */
  rooms: ChatRoom[];
  /** 검색된 사용자 */
  users: ChatMember[];
  /** 총 검색 결과 수 */
  totalCount: number;
}

/**
 * 실시간 채팅 이벤트 타입
 */
export type ChatEventType = 
  | 'message_sent'
  | 'message_edited'
  | 'message_deleted'
  | 'user_joined'
  | 'user_left'
  | 'user_typing'
  | 'user_stopped_typing'
  | 'room_created'
  | 'room_updated'
  | 'room_deleted';

/**
 * 실시간 채팅 이벤트 인터페이스
 */
export interface ChatEvent {
  /** 이벤트 타입 */
  type: ChatEventType;
  /** 채팅방 ID */
  roomId: string;
  /** 이벤트 데이터 */
  data: any;
  /** 이벤트 발생 시간 */
  timestamp: Date;
  /** 이벤트 발생자 ID */
  userId?: string;
} 