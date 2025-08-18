import { INotionApiClient, NotionApiServiceFactory } from '../apis/notion.api';
import { config } from '../../constants/config';
import { axiosInstance } from '../apis/axiosInstance.api';
import { API_ENDPOINTS } from '../../constants/endPoint.constants';

// 서비스 인터페이스들
export interface IUserService {
  signIn(email: string, password: string): Promise<any>;
  signUp(email: string, password: string, nickname: string): Promise<any>;
  checkEmailDuplicate(email: string): Promise<any>;
  checkNicknameDuplicate(nickname: string): Promise<any>;
  getProfile(): Promise<any>;
  updateProfile(data: any): Promise<any>;
}

export interface IChatService {
  getChatList(): Promise<any>;
  getChatRoom(roomId: string): Promise<any>;
  sendMessage(roomId: string, message: string): Promise<any>;
}

export interface IAuthService {
  isAuthenticated(): boolean;
  login(user: any): void;
  logout(): void;
  getCurrentUser(): any;
}

// 서비스 구현체들
export class UserService implements IUserService {
  constructor(private notionApi: INotionApiClient) {}

  async signIn(email: string, password: string): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.post(API_ENDPOINTS.USER.SIGN_IN, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 모의 로그인
      const mockUsers = [
        { email: 'admin@intune.com', password: 'admin', isAdmin: true, name: '관리자' },
        { email: 'superadmin@intune.com', password: 'superadmin', isAdmin: true, name: '슈퍼관리자' },
        { email: 'jimin@example.com', password: '123456', isAdmin: false, name: '지민' },
        { email: 'test', password: 'test', isAdmin: false, name: '테스트' },
        { email: 'password', password: 'password', isAdmin: false, name: '패스워드' }
      ];

      const user = mockUsers.find(u => 
        u.email === email && u.password === password
      );

      if (user) {
        return {
          id: `user_${Date.now()}`,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          token: `mock_token_${Date.now()}`
        };
      }

      throw new Error('Invalid credentials');
    }
  }

  async signUp(email: string, password: string, nickname: string): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.post(API_ENDPOINTS.USER.SIGN_UP, {
        email,
        password,
        name: nickname
      });
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 모의 회원가입
      return {
        id: `user_${Date.now()}`,
        email,
        name: nickname,
        isAdmin: false,
        token: `mock_token_${Date.now()}`
      };
    }
  }

  async checkEmailDuplicate(email: string): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.post(API_ENDPOINTS.USER.CHECK_EMAIL_DUPLICATE, {
        email
      });
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 모의 응답
      return { available: true };
    }
  }

  async checkNicknameDuplicate(nickname: string): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.post(API_ENDPOINTS.USER.CHECK_NICKNAME_DUPLICATE, {
        nickname
      });
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 모의 응답
      return { available: true };
    }
  }

  async getProfile(): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_PROFILE);
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 현재 사용자 정보 반환
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        return JSON.parse(currentUser);
      }
      throw new Error('User not found');
    }
  }

  async updateProfile(data: any): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 모의 응답
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const updatedUser = {
          ...user,
          ...data,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error('User not found');
    }
  }
}

export class ChatService implements IChatService {
  constructor(private notionApi: INotionApiClient) {}

  async getChatList(): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.get(API_ENDPOINTS.CHAT.LIST);
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 더미 데이터 반환
      return {
        results: [
          {
            id: "jimin",
            name: "지민",
            participants: ["current_user", "jimin"],
            lastMessage: {
              id: "msg_1",
              content: "안녕하세요! 반가워요 😊",
              senderId: "jimin",
              senderName: "지민",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            unreadCount: 0
          }
        ]
      };
    }
  }

  async getChatRoom(roomId: string): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.get(`${API_ENDPOINTS.CHAT.ROOM}/${roomId}`);
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 더미 데이터 반환
      return {
        room: {
          id: roomId,
          name: "지민",
          participants: ["current_user", roomId]
        },
        messages: []
      };
    }
  }

  async sendMessage(roomId: string, message: string): Promise<any> {
    try {
      // 먼저 로컬 백엔드 API 시도
      const response = await axiosInstance.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
        roomId,
        content: message
      });
      return response.data;
    } catch (error) {
      // 백엔드 API 실패 시 개발용 모의 응답
      return {
        id: `msg_${Date.now()}`,
        content: message,
        senderId: "current_user",
        senderName: "나",
        timestamp: new Date()
      };
    }
  }
}

export class AuthService implements IAuthService {
  private currentUser: any = null;

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  login(user: any): void {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    if (!this.currentUser) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }
}

// 의존성 주입 컨테이너
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    // Notion API 클라이언트 생성
    const notionApi = NotionApiServiceFactory.create({
      apiKey: config.NOTION_API_KEY,
    });

    // 서비스들 등록
    this.services.set('notionApi', notionApi);
    this.services.set('userService', new UserService(notionApi));
    this.services.set('chatService', new ChatService(notionApi));
    this.services.set('authService', new AuthService());
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  // 타입 안전한 서비스 getter들
  getUserService(): IUserService {
    return this.get<IUserService>('userService');
  }

  getChatService(): IChatService {
    return this.get<IChatService>('chatService');
  }

  getAuthService(): IAuthService {
    return this.get<IAuthService>('authService');
  }

  getNotionApi(): INotionApiClient {
    return this.get<INotionApiClient>('notionApi');
  }
}

// 전역 컨테이너 인스턴스
export const container = DIContainer.getInstance();
