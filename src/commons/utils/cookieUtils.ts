/**
 * 쿠키 옵션 인터페이스
 */
interface CookieOptions {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
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
    path = "/",
    domain,
    secure = true,
    httpOnly = false,
    sameSite = "Lax",
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
    cookieString += "; secure";
  }

  if (httpOnly) {
    cookieString += "; httpOnly";
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
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
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
export const deleteCookie = (
  name: string,
  options: { path?: string; domain?: string } = {}
): void => {
  const { path = "/", domain } = options;

  // 과거 날짜로 설정하여 쿠키 삭제
  const expires = new Date(0);

  setCookie(name, "", {
    expires,
    path,
    domain,
    secure: true,
    sameSite: "Lax",
  });
};

/**
 * 모든 쿠키를 확인합니다.
 * @returns 모든 쿠키 객체
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};

  if (document.cookie) {
    document.cookie.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
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
  ACCESS_TOKEN: "access_token",
} as const;

/**
 * 액세스 토큰을 쿠키에서 읽습니다.
 * @returns 액세스 토큰 또는 null
 */
export const getAccessTokenFromCookie = (): string | null => {
  return getCookie(AUTH_COOKIES.ACCESS_TOKEN);
};

/**
 * 모든 인증 쿠키를 삭제합니다.
 */
export const clearAuthCookies = (): void => {
  deleteCookie(AUTH_COOKIES.ACCESS_TOKEN);
};

/**
 * 쿠키 기반으로 로그인 상태를 확인합니다.
 * @returns 로그인 상태
 */
export const isLoggedInFromCookies = (): boolean => {
  const accessToken = getAccessTokenFromCookie();

  return !!accessToken;
};
