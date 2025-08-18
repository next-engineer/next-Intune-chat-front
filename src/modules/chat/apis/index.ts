/**
 * Chat API 모듈
 * - 서버가 UTF-8 문자열(ISO8601 또는 epoch 문자열/숫자)로 내려주는 타임스탬프를
 *   프론트에서 Date 객체로 변환해 일관되게 사용합니다.
 * - 목록/상세/전송 응답 모두 공통 매핑 함수를 통해 정규화합니다.
 */
import { container } from "../../../commons/di/container";
import { useAuthStore } from "../../../stores/authStore";

/**
 * 지민과의 더미 대화 데이터
 * - 실제 채팅처럼 보이도록 자연스러운 대화 흐름 구성
 * - 7일 전부터 2일 전까지의 시간순 대화 기록
 * - 프로그래밍, 일상, 영화 등 다양한 주제로 구성
 * - 이모지를 활용한 친근한 톤의 대화
 */
const JIMIN_DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    content: "안녕하세요! 반가워요 😊",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
  },
  {
    id: "msg_2",
    content: "안녕하세요! 저도 반가워요 😄",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000), // 5분 후
  },
  {
    id: "msg_3",
    content: "오늘 날씨가 정말 좋네요! 뭐 하고 계세요?",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000), // 10분 후
  },
  {
    id: "msg_4",
    content: "집에서 영화 보고 있어요. 지민님은요?",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000), // 15분 후
  },
  {
    id: "msg_5",
    content: "저는 카페에서 공부하고 있어요 📚",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // 20분 후
  },
  {
    id: "msg_6",
    content: "와! 정말 부지런하시네요. 뭐 공부하고 계세요?",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000), // 25분 후
  },
  {
    id: "msg_7",
    content: "프로그래밍 공부하고 있어요. 코딩이 재미있어요! 💻",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30분 후
  },
  {
    id: "msg_8",
    content: "저도 프로그래밍 좋아해요! 어떤 언어를 공부하고 계세요?",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000), // 35분 후
  },
  {
    id: "msg_9",
    content: "JavaScript와 React를 공부하고 있어요. 프론트엔드 개발자가 되고 싶어요!",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000), // 40분 후
  },
  {
    id: "msg_10",
    content: "정말 멋진 목표네요! 저도 개발자에 관심이 많아요",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 45분 후
  },
  {
    id: "msg_11",
    content: "그럼 같이 공부할 수 있을 것 같아요! 😊",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000), // 50분 후
  },
  {
    id: "msg_12",
    content: "좋아요! 언제 한번 만나서 얘기해요",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000), // 55분 후
  },
  {
    id: "msg_13",
    content: "네! 기대돼요 😄",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1시간 후
  },
  {
    id: "msg_14",
    content: "오늘 정말 즐거웠어요. 다음에 또 얘기해요!",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6일 전
  },
  {
    id: "msg_15",
    content: "네! 저도 즐거웠어요. 다음에 봐요! 👋",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000), // 5분 후
  },
  {
    id: "msg_16",
    content: "안녕하세요! 오늘도 좋은 하루 되세요 😊",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
  },
  {
    id: "msg_17",
    content: "안녕하세요! 지민님도 좋은 하루 되세요!",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000), // 10분 후
  },
  {
    id: "msg_18",
    content: "오늘 뭐 할 계획이세요?",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000), // 15분 후
  },
  {
    id: "msg_19",
    content: "친구들과 만나서 영화 보러 갈 예정이에요. 지민님은요?",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // 20분 후
  },
  {
    id: "msg_20",
    content: "와! 재미있겠네요. 저는 집에서 휴식하고 있을 예정이에요 🏠",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000), // 25분 후
  },
  {
    id: "msg_21",
    content: "좋은 휴식 되세요! 다음에 또 얘기해요 😊",
    senderId: "current_user",
    senderName: "나",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30분 후
  },
  {
    id: "msg_22",
    content: "네! 즐거운 시간 보내세요! 🎬",
    senderId: "jimin",
    senderName: "지민",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000), // 35분 후
  },
];

/**
 * 더미 채팅방 데이터
 * - 개발/테스트용 채팅방 목록
 * - 지민, 서연, 민지와의 채팅방 포함
 * - 각 채팅방별 마지막 메시지와 읽지 않은 메시지 수 표시
 */
const DUMMY_CHAT_ROOMS: ChatRoom[] = [
  {
    id: "jimin",
    name: "지민",
    participants: ["current_user", "jimin"],
    lastMessage: JIMIN_DUMMY_MESSAGES[JIMIN_DUMMY_MESSAGES.length - 1],
    unreadCount: 0,
  },
  {
    id: "seoyeon",
    name: "서연",
    participants: ["current_user", "seoyeon"],
    lastMessage: {
      id: "msg_seoyeon_1",
      content: "안녕하세요! 반가워요 😊",
      senderId: "seoyeon",
      senderName: "서연",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
    },
    unreadCount: 1,
  },
  {
    id: "minji",
    name: "민지",
    participants: ["current_user", "minji"],
    lastMessage: {
      id: "msg_minji_1",
      content: "오늘 날씨가 정말 좋네요!",
      senderId: "current_user",
      senderName: "나",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    },
    unreadCount: 0,
  },
];

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
  imageUrl?: string;
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
   * - 개발 환경에서는 더미 데이터를 반환하여 실제 API 없이도 테스트 가능
   * - 실제 운영 환경에서는 주석 처리된 API 호출 코드를 사용
   */
  getChatList: async (): Promise<ChatRoom[]> => {
    try {
      const chatService = container.getChatService();
      return await chatService.getChatList();
    } catch (error) {
      // 개발용 더미 데이터 반환
      return DUMMY_CHAT_ROOMS;
    }
  },

  /**
   * 채팅방 상세 및 메시지 목록 조회
   * - 지민 채팅방의 경우 22개의 더미 대화 메시지를 반환
   * - 내 메시지와 상대방 메시지를 구분하기 위해 실제 사용자 ID로 senderId 매핑
   * - 다른 채팅방은 빈 메시지 목록 반환
   */
  getChatRoom: async (roomId: string): Promise<{ room: ChatRoom; messages: ChatMessage[] }> => {
    try {
      // 지민 채팅방: 22개의 더미 대화 메시지 반환
      if (roomId === "jimin") {
        const room = DUMMY_CHAT_ROOMS.find((r) => r.id === "jimin");
        if (room) {
          // 실제 로그인한 사용자의 ID를 가져와서 내 메시지 구분
          const currentUserId = "user_default"; // 임시로 고정값 사용
          const modifiedMessages = JIMIN_DUMMY_MESSAGES.map((msg) => ({
            ...msg,
            senderId: msg.senderId === "current_user" ? currentUserId : msg.senderId,
          }));
          return { room, messages: modifiedMessages };
        }
      }

      // 다른 채팅방: 빈 메시지 목록 반환
      const room = DUMMY_CHAT_ROOMS.find((r) => r.id === roomId) || DUMMY_CHAT_ROOMS[0];
      return { room, messages: [] };

      // 실제 API 호출 (운영 환경에서 사용)
      // const response = await axiosInstance.get(`${API_ENDPOINTS.CHAT.ROOM}/${roomId}`);
      // const data = response.data || {};
      // const room = mapChatRoom(data.room);
      // const messages = Array.isArray(data.messages) ? data.messages.map(mapChatMessage) : [];
      // return { room, messages };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 메시지 전송
   * - 개발 환경에서는 실제 로그인한 사용자 정보로 새 메시지 생성
   * - 실제 운영 환경에서는 서버에 메시지 전송 후 응답 반환
   */
  sendMessage: async (data: SendMessageRequest): Promise<ChatMessage> => {
    try {
      // 개발용: 실제 사용자 정보로 새 메시지 생성
      const currentUserId = "user_default";
      const currentUserName = "나";

      const newMessage: ChatMessage = {
        id: "msg_" + Date.now(),
        content: data.content,
        senderId: currentUserId,
        senderName: currentUserName,
        timestamp: new Date(),
      };

      return newMessage;

      // 실제 API 호출 (운영 환경에서 사용)
      // const response = await axiosInstance.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, data);
      // return mapChatMessage(response.data);
    } catch (error) {
      throw error;
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
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
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
    id: String(raw?.id ?? ""),
    content: String(raw?.content ?? ""),
    senderId: String(raw?.senderId ?? ""),
    senderName: String(raw?.senderName ?? ""),
    timestamp: toDate(raw?.timestamp),
  };
}

/**
 * 서버 응답 채팅방 정보를 정규화하여 ChatRoom으로 변환합니다.
 */
function mapChatRoom(raw: any): ChatRoom {
  const base: ChatRoom = {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? ""),
    participants: Array.isArray(raw?.participants) ? raw.participants.map(String) : [],
    unreadCount: Number(raw?.unreadCount ?? 0),
  };

  if (raw?.lastMessage) {
    base.lastMessage = mapChatMessage(raw.lastMessage);
  }

  return base;
}
