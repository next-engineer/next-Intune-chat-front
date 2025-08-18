export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiErrorHandler {
  static handle(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'No response from server',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An error occurred',
        status: 0,
      };
    }
  }

  static isNetworkError(error: any): boolean {
    return !error.response && error.request;
  }

  static isServerError(error: any): boolean {
    return error.response && error.response.status >= 500;
  }

  static isClientError(error: any): boolean {
    return error.response && error.response.status >= 400 && error.response.status < 500;
  }
} 