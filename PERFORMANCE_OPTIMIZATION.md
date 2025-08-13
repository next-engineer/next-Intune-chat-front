# 성능 최적화 가이드

## 개요
이 문서는 React + TypeScript + Vite 프로젝트의 성능 최적화 작업을 설명합니다.

## 적용된 최적화 기법

### 1. 빌드 최적화 (Vite 설정)

#### 청크 분할 (Code Splitting)
```typescript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
      router: ['react-router-dom'],
      utils: ['axios', 'zod'],
      websocket: ['ws'],
    },
  },
}
```

#### 압축 최적화
- **Terser**: 더 나은 JavaScript 압축
- **Console 제거**: 프로덕션에서 console.log 제거
- **소스맵 비활성화**: 프로덕션에서 소스맵 비활성화

### 2. React 컴포넌트 최적화

#### 메모이제이션 (Memoization)
```typescript
// React.memo를 사용한 컴포넌트 메모이제이션
const FeatureCard = React.memo<Props>(({ icon, title, description }) => (
  // 컴포넌트 내용
));

// useMemo를 사용한 값 메모이제이션
const features = useMemo(() => [
  // 데이터 배열
], []);

// useCallback을 사용한 함수 메모이제이션
const handleClick = useCallback(() => {
  // 이벤트 핸들러
}, []);
```

#### 코드 스플리팅 (Code Splitting)
```typescript
// React.lazy를 사용한 지연 로딩
const HomePage = lazy(() => import('./pages/home'));

// Suspense를 사용한 로딩 상태 관리
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</Suspense>
```

### 3. 채팅 컴포넌트 최적화

#### 메시지 렌더링 최적화
- **메모이제이션된 메시지 컴포넌트**: `MessageItem`
- **메시지 그룹화**: 날짜별로 메시지 그룹화
- **가상화 준비**: 대량 메시지 처리를 위한 가상화 구조

#### 상태 관리 최적화
```typescript
// 메모이제이션된 정렬된 메시지
const sortedMessages = useMemo(() => {
  return [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}, [messages]);

// 메모이제이션된 그룹화된 메시지
const groupedMessages = useMemo(() => {
  // 메시지 그룹화 로직
}, [sortedMessages]);
```

### 4. 검색 컴포넌트 최적화

#### 디바운싱 (Debouncing)
```typescript
// 300ms 디바운스된 검색
const debouncedSearch = useMemo(
  () => debounce(async (searchQuery: string) => {
    // 검색 로직
  }, 300),
  []
);
```

#### 검색 결과 메모이제이션
- **검색 결과 컴포넌트**: `SearchResultItem`
- **로딩 상태 최적화**: 스피너 및 에러 상태 관리

### 5. 유틸리티 함수 최적화

#### 성능 최적화 유틸리티
```typescript
// 디바운스
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  // 디바운스 구현
};

// 쓰로틀링
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  // 쓰로틀링 구현
};

// 메모이제이션
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): T => {
  // 메모이제이션 구현
};
```

#### 고급 최적화 유틸리티
- **가상화 계산**: 대량 데이터 렌더링 최적화
- **Intersection Observer**: 이미지 지연 로딩
- **성능 측정**: 함수 실행 시간 측정
- **메모리 사용량 측정**: 메모리 사용량 모니터링

### 6. 이미지 최적화

#### OptimizedImage 컴포넌트
```typescript
// 지연 로딩, 플레이스홀더, 에러 처리
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholder,
  fallback,
  loading = 'lazy',
  // ...
}) => {
  // 최적화된 이미지 로딩 로직
};
```

## 성능 측정 방법

### 1. 개발자 도구 활용
- **Chrome DevTools Performance 탭**: 렌더링 성능 분석
- **React DevTools Profiler**: 컴포넌트 렌더링 시간 측정
- **Network 탭**: 번들 크기 및 로딩 시간 확인

### 2. 성능 측정 유틸리티
```typescript
// 함수 실행 시간 측정
await measurePerformance('API 호출', async () => {
  const data = await api.getData();
  return data;
});

// 메모리 사용량 확인
const memoryUsage = getMemoryUsage();
console.log('메모리 사용량:', memoryUsage);
```

## 추가 최적화 권장사항

### 1. 서버 사이드 최적화
- **HTTP/2**: 멀티플렉싱 지원
- **Gzip/Brotli 압축**: 전송 데이터 크기 최소화
- **CDN 활용**: 정적 자원 전송 최적화

### 2. 캐싱 전략
- **브라우저 캐싱**: 정적 자원 캐싱
- **API 응답 캐싱**: 중복 요청 방지
- **메모리 캐싱**: 자주 사용되는 데이터 캐싱

### 3. 모니터링
- **성능 메트릭 수집**: Core Web Vitals 모니터링
- **에러 추적**: 사용자 경험 영향 최소화
- **사용자 행동 분석**: 최적화 포인트 발견

## 성능 체크리스트

### 빌드 최적화
- [x] 청크 분할 적용
- [x] 압축 최적화 설정
- [x] 소스맵 비활성화 (프로덕션)
- [x] Console 로그 제거 (프로덕션)

### React 최적화
- [x] React.memo 적용
- [x] useMemo/useCallback 활용
- [x] 코드 스플리팅 구현
- [x] Suspense 경계 설정

### 컴포넌트 최적화
- [x] 채팅 컴포넌트 메모이제이션
- [x] 검색 디바운싱 적용
- [x] 이미지 지연 로딩 구현
- [x] 이벤트 핸들러 최적화

### 유틸리티 최적화
- [x] 디바운스/쓰로틀링 유틸리티
- [x] 메모이제이션 헬퍼
- [x] 성능 측정 도구
- [x] 가상화 준비

## 결론

이러한 최적화를 통해 다음과 같은 성능 향상을 기대할 수 있습니다:

1. **초기 로딩 시간 단축**: 코드 스플리팅과 청크 분할
2. **렌더링 성능 향상**: 메모이제이션과 최적화된 컴포넌트
3. **사용자 경험 개선**: 지연 로딩과 스무스한 인터랙션
4. **메모리 사용량 최적화**: 효율적인 상태 관리와 정리

지속적인 모니터링과 추가 최적화를 통해 더 나은 성능을 달성할 수 있습니다.
