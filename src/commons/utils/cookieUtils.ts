/**
 * 쿠키 관리 유틸리티
 * - 쿠키 설정, 읽기, 삭제 기능을 제공합니다.
 * - 보안을 위한 HttpOnly, Secure 옵션을 지원합니다.
 * - 해시 기반 토큰 관리를 지원합니다.
 */

import { hashToken } from './hashUtils';

/**
 * 쿠키 옵션 인터페이스
 */
interface CookieOptions {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * 쿠키를 설정합니다.
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param options 쿠키 옵션
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  const {
    expires,
    path = '/',
    domain,
    secure = true,
    httpOnly = false,
    sameSite = 'Lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  if (httpOnly) {
    cookieString += '; httpOnly';
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * 쿠키를 읽습니다.
 * @param name 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
};

/**
 * 쿠키를 삭제합니다.
 * @param name 쿠키 이름
 * @param options 쿠키 옵션 (삭제 시에는 path와 domain이 중요)
 */
export const deleteCookie = (name: string, options: { path?: string; domain?: string } = {}): void => {
  const { path = '/', domain } = options;
  
  // 과거 날짜로 설정하여 쿠키 삭제
  const expires = new Date(0);
  
  setCookie(name, '', {
    expires,
    path,
    domain,
    secure: true,
    sameSite: 'Lax'
  });
};

/**
 * 모든 쿠키를 확인합니다.
 * @returns 모든 쿠키 객체
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
  }
  
  return cookies;
};

/**
 * 인증 관련 쿠키 이름들
 */
export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'intune_access_token',
  REFRESH_TOKEN: 'intune_refresh_token',
  USER_ID: 'intune_user_id',
  USER_NAME: 'intune_user_name',
  USER_EMAIL: 'intune_user_email',
  USER_IS_ADMIN: 'intune_user_is_admin'
} as const;

/**
 * 인증 토큰을 쿠키에 저장합니다.
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰 (선택사항)
 */
export const setAuthCookies = async (accessToken: string, refreshToken?: string): Promise<void> => {
  // 토큰 해싱
  const hashedAccessToken = await hashToken(accessToken);
  
  // 액세스 토큰 (1시간 만료)
  const accessTokenExpires = new Date();
  accessTokenExpires.setHours(accessTokenExpires.getHours() + 1);
  
  setCookie(AUTH_COOKIES.ACCESS_TOKEN, hashedAccessToken, {
    expires: accessTokenExpires,
    secure: true,
    sameSite: 'Lax'
  });

  // 리프레시 토큰 (7일 만료)
  if (refreshToken) {
    const hashedRefreshToken = await hashToken(refreshToken);
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7);
    
    setCookie(AUTH_COOKIES.REFRESH_TOKEN, hashedRefreshToken, {
      expires: refreshTokenExpires,
      secure: true,
      sameSite: 'Lax'
    });
  }
};

/**
 * 사용자 정보를 쿠키에 저장합니다.
 * @param user 사용자 정보
 */
export const setUserCookies = (user: { id: string; name: string; email: string; isAdmin?: boolean }): void => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7일 만료

  setCookie(AUTH_COOKIES.USER_ID, user.id, {
    expires,
    secure: true,
    sameSite: 'Lax'
  });

  setCookie(AUTH_COOKIES.USER_NAME, user.name, {
    expires,
    secure: true,
    sameSite: 'Lax'
  });

  setCookie(AUTH_COOKIES.USER_EMAIL, user.email, {
    expires,
    secure: true,
    sameSite: 'Lax'
  });

  // isAdmin 정보 저장 (있는 경우에만)
  if (user.isAdmin !== undefined) {
    setCookie(AUTH_COOKIES.USER_IS_ADMIN, user.isAdmin.toString(), {
      expires,
      secure: true,
      sameSite: 'Lax'
    });
  }
};

/**
 * 인증 쿠키에서 사용자 정보를 읽습니다.
 * @returns 사용자 정보 또는 null
 */
export const getUserFromCookies = (): { id: string; name: string; email: string; isAdmin?: boolean } | null => {
  const userId = getCookie(AUTH_COOKIES.USER_ID);
  const userName = getCookie(AUTH_COOKIES.USER_NAME);
  const userEmail = getCookie(AUTH_COOKIES.USER_EMAIL);
  const userIsAdmin = getCookie(AUTH_COOKIES.USER_IS_ADMIN);

  if (userId && userName && userEmail) {
    return {
      id: userId,
      name: userName,
      email: userEmail,
      isAdmin: userIsAdmin === 'true'
    };
  }

  return null;
};

/**
 * 액세스 토큰을 쿠키에서 읽습니다.
 * @returns 액세스 토큰 또는 null
 */
export const getAccessTokenFromCookie = (): string | null => {
  return getCookie(AUTH_COOKIES.ACCESS_TOKEN);
};

/**
 * 리프레시 토큰을 쿠키에서 읽습니다.
 * @returns 리프레시 토큰 또는 null
 */
export const getRefreshTokenFromCookie = (): string | null => {
  return getCookie(AUTH_COOKIES.REFRESH_TOKEN);
};

/**
 * 모든 인증 쿠키를 삭제합니다.
 */
export const clearAuthCookies = (): void => {
  deleteCookie(AUTH_COOKIES.ACCESS_TOKEN);
  deleteCookie(AUTH_COOKIES.REFRESH_TOKEN);
  deleteCookie(AUTH_COOKIES.USER_ID);
  deleteCookie(AUTH_COOKIES.USER_NAME);
  deleteCookie(AUTH_COOKIES.USER_EMAIL);
  deleteCookie(AUTH_COOKIES.USER_IS_ADMIN);
};

/**
 * 쿠키 기반으로 로그인 상태를 확인합니다.
 * @returns 로그인 상태
 */
export const isLoggedInFromCookies = (): boolean => {
  const accessToken = getAccessTokenFromCookie();
  const user = getUserFromCookies();
  
  return !!(accessToken && user);
};
