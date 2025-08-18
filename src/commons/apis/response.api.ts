export interface ApiResponse<T = any> {
  data: T;
  code: string;
  message: string;
}

export class ResponseHandler {
  static success<T>(
    data: T,
    code: string = "SU",
    message: string = "요청이 성공적으로 처리되었습니다."
  ): ApiResponse<T> {
    return {
      data,
      code,
      message,
    };
  }

  static error<T>(code: string, message: string): ApiResponse<T> {
    return {
      data: null as T,
      code,
      message,
    };
  }

  static isSuccess(response: ApiResponse): boolean {
    return response.code === "SU";
  }

  static getData<T>(response: ApiResponse<T>): T {
    return response.data;
  }

  static getMessage(response: ApiResponse): string {
    return response.message;
  }
}
