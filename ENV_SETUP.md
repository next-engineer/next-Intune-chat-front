# 🌍 환경 변수 설정 가이드

## 📁 환경 변수 파일 구조

```
Frontend-main/
├── .env                    # 실제 사용할 환경 변수 (Git에 커밋되지 않음)
├── env.example            # 개발용 템플릿
├── env.staging           # AWS 스테이징 환경
├── env.production        # AWS 프로덕션 환경
└── ENV_SETUP.md         # 이 파일
```

## 🚀 환경별 설정 방법

### 1. 개발 환경 설정

```bash
# 1. 템플릿 파일을 .env로 복사
cp env.example .env

# 2. .env 파일을 편집하여 실제 값으로 수정
# VITE_API_URL=http://localhost:8080
# VITE_WEBSOCKET_URL=wss://localhost:8080/ws
```

### 2. AWS 스테이징 환경 설정

```bash
# 1. 스테이징 환경 파일을 .env로 복사
cp env.staging .env

# 2. 실제 AWS 리소스 값으로 수정
# VITE_API_URL=https://실제-API-Gateway-URL.execute-api.ap-northeast-2.amazonaws.com/staging
```

### 3. AWS 프로덕션 환경 설정

```bash
# 1. 프로덕션 환경 파일을 .env로 복사
cp env.production .env

# 2. 실제 AWS 리소스 값으로 수정
# VITE_API_URL=https://실제-API-Gateway-URL.execute-api.ap-northeast-2.amazonaws.com/prod
```

## 🔧 주요 환경 변수 설명

### API 설정
- `VITE_API_URL`: 백엔드 API 서버 주소
- `VITE_WEBSOCKET_URL`: WebSocket 연결 주소

### AWS 설정
- `VITE_AWS_REGION`: AWS 리전 (한국: ap-northeast-2)
- `VITE_AWS_COGNITO_USER_POOL_ID`: Cognito 사용자 풀 ID
- `VITE_AWS_COGNITO_CLIENT_ID`: Cognito 클라이언트 ID
- `VITE_AWS_S3_BUCKET_NAME`: S3 버킷 이름
- `VITE_AWS_CLOUDFRONT_DISTRIBUTION_ID`: CloudFront 배포 ID

### 기능 플래그
- `VITE_ENABLE_CHAT`: 채팅 기능 활성화
- `VITE_ENABLE_NOTION`: Notion 기능 활성화
- `VITE_ENABLE_PINGPONG`: PingPong 기능 활성화

### 타임아웃 설정
- `VITE_API_TIMEOUT`: API 요청 타임아웃 (밀리초)
- `VITE_WEBSOCKET_PING_INTERVAL`: WebSocket 핑 간격 (밀리초)
- `VITE_WEBSOCKET_PONG_TIMEOUT`: WebSocket 퐁 응답 대기 시간 (밀리초)

## ⚡ 자동 참조 시스템

### 🎯 핵심 파일들

1. **`src/constants/config.ts`** - 환경 변수 관리 중앙화
2. **`src/constants/endPoint.constants.ts`** - API 엔드포인트 설정
3. **`src/commons/apis/axiosInstance.api.ts`** - HTTP 클라이언트 설정
4. **`src/components/ConfigDisplay.tsx`** - 개발 모드 디버그 컴포넌트

### 🔄 자동 참조 방식

```typescript
// 1. config.ts에서 환경 변수 로드
import { config } from '../constants/config';

// 2. 다른 파일에서 config 사용
const apiUrl = config.API_URL;
const isDevMode = config.DEV_MODE;
const enableChat = config.ENABLE_CHAT;
```

### 📊 개발 모드 디버그

개발 모드에서 화면 우하단에 환경 변수 정보가 자동으로 표시됩니다:

- API URL
- WebSocket URL
- 앱 이름/버전
- AWS 리전
- 기능 플래그 상태

## 🔒 보안 주의사항

### ❌ 하지 말아야 할 것들
- `.env` 파일을 Git에 커밋하지 마세요
- API 키를 코드에 하드코딩하지 마세요
- 프로덕션 환경 변수를 개발 환경에서 사용하지 마세요

### ✅ 해야 할 것들
- `.env.example` 파일을 Git에 커밋하세요
- 환경별로 다른 설정 파일을 사용하세요
- 민감한 정보는 AWS Secrets Manager나 환경 변수로 관리하세요

## 🛠️ AWS 리소스 생성 순서

1. **API Gateway 생성**
   - REST API 생성
   - WebSocket API 생성
   - 스테이징/프로덕션 스테이지 생성

2. **Cognito User Pool 생성**
   - 사용자 풀 생성
   - 앱 클라이언트 생성

3. **S3 버킷 생성**
   - 정적 웹사이트 호스팅용 버킷
   - CORS 설정

4. **CloudFront 배포 생성**
   - S3 버킷을 오리진으로 설정
   - 캐시 정책 설정

## 📝 실제 값 예시

```bash
# API Gateway URL 예시
VITE_API_URL=https://abc123def.execute-api.ap-northeast-2.amazonaws.com/prod

# WebSocket URL 예시
VITE_WEBSOCKET_URL=wss://xyz789uvw.execute-api.ap-northeast-2.amazonaws.com/prod

# Cognito 설정 예시
VITE_AWS_COGNITO_USER_POOL_ID=ap-northeast-2_XXXXXXXXX
VITE_AWS_COGNITO_CLIENT_ID=1234567890abcdefghijklmnop

# S3 버킷 예시
VITE_AWS_S3_BUCKET_NAME=intune-frontend-prod

# CloudFront 배포 예시
VITE_AWS_CLOUDFRONT_DISTRIBUTION_ID=E123456789ABCDEF
```

## 🔄 환경 전환 스크립트

```bash
# 개발 환경으로 전환
npm run env:dev

# 스테이징 환경으로 전환
npm run env:staging

# 프로덕션 환경으로 전환
npm run env:production
```

## 📞 문제 해결

### 환경 변수가 적용되지 않는 경우
1. Vite 서버 재시작: `npm run dev`
2. 브라우저 캐시 삭제
3. 환경 변수 이름이 `VITE_`로 시작하는지 확인
4. 개발 모드 디버그 컴포넌트에서 설정 확인

### AWS 연결 문제
1. AWS 리전이 올바른지 확인
2. IAM 권한이 올바르게 설정되었는지 확인
3. CORS 설정이 올바른지 확인

## 🎯 사용 예시

### 컴포넌트에서 환경 변수 사용

```typescript
import { config } from '../constants/config';

const MyComponent = () => {
  // 기능 플래그 확인
  if (!config.ENABLE_CHAT) {
    return <div>채팅 기능이 비활성화되었습니다.</div>;
  }

  // API URL 사용
  const apiUrl = config.API_URL;
  
  // 개발 모드 확인
  if (config.DEV_MODE) {
    console.log('개발 모드에서 실행 중');
  }

  return <div>컴포넌트 내용</div>;
};
```

### API 호출에서 환경 변수 사용

```typescript
import { config } from '../constants/config';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
});
```
