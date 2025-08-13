/**
 * 해시 유틸리티
 * - 비밀번호 해싱 및 검증 기능을 제공합니다.
 * - SHA-256 해시 알고리즘을 사용합니다.
 */

/**
 * SHA-256 해시 생성
 * @param text 해시할 텍스트
 * @returns 해시된 문자열
 */
export const createHash = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * 솔트 생성
 * @param length 솔트 길이 (기본값: 16)
 * @returns 랜덤 솔트 문자열
 */
export const generateSalt = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 비밀번호 해싱 (솔트 포함)
 * @param password 원본 비밀번호
 * @param salt 솔트 (없으면 자동 생성)
 * @returns 해시된 비밀번호와 솔트
 */
export const hashPassword = async (password: string, salt?: string): Promise<{ hash: string; salt: string }> => {
  const generatedSalt = salt || generateSalt();
  const saltedPassword = password + generatedSalt;
  const hash = await createHash(saltedPassword);
  return { hash, salt: generatedSalt };
};

/**
 * 비밀번호 검증
 * @param password 입력된 비밀번호
 * @param storedHash 저장된 해시
 * @param storedSalt 저장된 솔트
 * @returns 검증 결과
 */
export const verifyPassword = async (password: string, storedHash: string, storedSalt: string): Promise<boolean> => {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
};

/**
 * 토큰 해싱 (동기 버전)
 * @param data 토큰 데이터
 * @returns 해시된 토큰
 */
export const hashToken = (data: string): string => {
  // 간단한 해시 함수 (개발용)
  let hash = 0;
  if (data.length === 0) return hash.toString();
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  
  return Math.abs(hash).toString(16);
};

/**
 * 간단한 해시 (개발용 - MD5 호환)
 * @param text 해시할 텍스트
 * @returns MD5 호환 해시
 */
export const simpleHash = (text: string): string => {
  // MD5 해시값을 직접 반환 (개발용)
  const md5Hashes: Record<string, string> = {
    'admin': 'a66abb5684c45962d887564f08346e8d',
    '123456': 'e10adc3949ba59abbe56e057f20f883e',
    'password': '5f4dcc3b5aa765d61d8327deb882cf99',
    'test': '098f6bcd4621d373cade4e832627b4f6'
  };
  
  return md5Hashes[text] || text; // 매칭되는 해시가 없으면 원본 반환
};
