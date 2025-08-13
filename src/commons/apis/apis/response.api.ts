export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  status: number;
}

export class ResponseHandler {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      data,
      message,
      success: true,
      status: 200,
    };
  }

  static error<T>(message: string, status: number = 400): ApiResponse<T> {
    return {
      data: null as T,
      message,
      success: false,
      status,
    };
  }

  static isSuccess(response: ApiResponse): boolean {
    return response.success && response.status >= 200 && response.status < 300;
  }

  static getData<T>(response: ApiResponse<T>): T {
    return response.data;
  }

  static getMessage(response: ApiResponse): string {
    return response.message;
  }
} 