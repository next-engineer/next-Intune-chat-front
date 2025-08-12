import axiosInstance from '../../../commons/apis/axiosInstance.api';
import { API_ENDPOINTS } from '../../../constants/endPoint.constants';
import { ApiErrorHandler } from '../../../commons/apis/error.api';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

export const userApi = {
  signIn: async (data: SignInRequest): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.USER.SIGN_IN, data);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  signUp: async (data: SignUpRequest): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.USER.SIGN_UP, data);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  match: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.MATCH);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
}; 