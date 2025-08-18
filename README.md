# Frontend Application

React + TypeScript 기반의 프론트엔드 애플리케이션입니다.

## 기능

- 사용자 인증 (로그인/회원가입)
- 채팅 기능
- Notion API 통합

## Notion API 통합

이 애플리케이션은 Notion API를 통합하여 다음과 같은 기능을 제공합니다:

### 주요 기능

1. **Notion 검색**: 페이지와 데이터베이스를 검색할 수 있습니다.
2. **데이터베이스 조회**: Notion 데이터베이스의 모든 페이지를 조회할 수 있습니다.
3. **페이지 조회**: Notion 페이지의 모든 블록 내용을 렌더링하여 표시합니다.

### 설정 방법

1. Notion Integration Token을 발급받습니다:
   - [Notion Developers](https://www.notion.so/my-integrations) 페이지에서 새 integration을 생성
   - Integration Token을 복사

2. 환경 변수를 설정합니다:
   ```bash
   # .env 파일 생성
   REACT_APP_NOTION_TOKEN=your_notion_integration_token_here
   ```

3. Notion 워크스페이스에 integration을 추가합니다:
   - Notion 페이지에서 Settings & members → Integrations → Add connections
   - 생성한 integration을 선택하여 추가

### 사용법

1. 애플리케이션에 로그인합니다.
2. `/notion` 경로로 이동합니다.
3. 검색 탭에서 Notion 페이지나 데이터베이스를 검색합니다.
4. 검색 결과를 클릭하여 상세 내용을 확인합니다.

### API 엔드포인트

- `GET /v1/databases/{database_id}`: 데이터베이스 조회
- `POST /v1/databases/{database_id}/query`: 데이터베이스 쿼리
- `GET /v1/pages/{page_id}`: 페이지 조회
- `GET /v1/blocks/{block_id}/children`: 블록 조회
- `POST /v1/search`: 검색

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 기술 스택

- React 18
- TypeScript
- Vite
- Axios
- Zustand
- React Router DOM
- Zod "# Frontend" 
# next-Intune-chat-front
