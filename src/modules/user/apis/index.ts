import { container } from "@/commons/di/container";

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  gender?: "M" | "F" | "";
  address?: string;
  mbti?: string;
  avatar?: string;
  token: string;
  createdAt?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  nickname?: string;
  gender?: "M" | "F" | "";
  address?: string;
  mbti?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  gender: "M" | "F" | "";
  address: string;
  mbti: string;
}

export interface DuplicateCheckResponse {
  available: boolean;
}

export const userApi = {
  signIn: async (data: SignInRequest) => {
    try {
      const userService = container.getUserService();
      return await userService.signIn(data.email, data.password);
    } catch (error) {
      throw error;
    }
  },

  signUp: async (data: SignUpRequest) => {
    try {
      const userService = container.getUserService();
      return await userService.signUp(data.email, data.password, data.name);
    } catch (error) {
      throw error;
    }
  },

  checkEmailDuplicate: async (email: string): Promise<DuplicateCheckResponse> => {
    try {
      const userService = container.getUserService();
      return await userService.checkEmailDuplicate(email);
    } catch (error) {
      throw error;
    }
  },

  checkNicknameDuplicate: async (nickname: string): Promise<DuplicateCheckResponse> => {
    try {
      const userService = container.getUserService();
      return await userService.checkNicknameDuplicate(nickname);
    } catch (error) {
      throw error;
    }
  },

  match: async (): Promise<any> => {
    try {
      const chatService = container.getChatService();
      return await chatService.getChatList();
    } catch (error) {
      throw error;
    }
  },

  // 프로필 조회
  getProfile: async (): Promise<UserResponse> => {
    try {
      const userService = container.getUserService();
      return await userService.getProfile();
    } catch (error) {
      throw error;
    }
  },

  // 프로필 수정
  updateProfile: async (data: ProfileUpdateRequest): Promise<UserResponse> => {
    try {
      const userService = container.getUserService();
      return await userService.updateProfile(data);
    } catch (error) {
      throw error;
    }
  },
};
