import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 공통 유틸리티 함수들
 * - 디바운스, 쓰로틀링, 메모이제이션 등 성능 최적화 함수들
 */

/**
 * 디바운스 함수
 * - 연속된 함수 호출을 일정 시간 후에 한 번만 실행하도록 제한
 * @param func 실행할 함수
 * @param wait 대기 시간 (밀리초)
 * @returns 디바운스된 함수
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 쓰로틀링 함수
 * - 함수 호출을 일정 시간 간격으로 제한
 * @param func 실행할 함수
 * @param limit 제한 시간 (밀리초)
 * @returns 쓰로틀링된 함수
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 메모이제이션 함수
 * - 함수 결과를 캐시하여 동일한 입력에 대해 재계산 방지
 * @param func 메모이제이션할 함수
 * @returns 메모이제이션된 함수
 */
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * 지연 실행 함수
 * - 함수를 다음 이벤트 루프에서 실행
 * @param func 실행할 함수
 * @returns Promise
 */
export const defer = (func: () => void): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      func();
      resolve();
    }, 0);
  });
};

/**
 * 배치 업데이트 함수
 * - 여러 상태 업데이트를 배치로 처리
 * @param updates 업데이트 함수들의 배열
 */
export const batchUpdate = (updates: (() => void)[]): void => {
  // React 18의 자동 배칭을 활용하기 위해 Promise.resolve() 사용
  Promise.resolve().then(() => {
    updates.forEach(update => update());
  });
};

/**
 * 가상화를 위한 아이템 높이 계산
 * @param items 아이템 배열
 * @param itemHeight 아이템 높이
 * @param containerHeight 컨테이너 높이
 * @returns 가상화 설정
 */
export const calculateVirtualization = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(window.scrollY / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  
  return {
    totalHeight,
    visibleCount,
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
    offsetY: startIndex * itemHeight,
  };
};

/**
 * 이미지 지연 로딩을 위한 Intersection Observer 설정
 * @param callback 콜백 함수
 * @param options 옵션
 * @returns Intersection Observer
 */
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * 성능 측정 유틸리티
 * @param name 측정 이름
 * @param fn 측정할 함수
 * @returns 함수 실행 결과
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  console.log(`${name} 실행 시간: ${(end - start).toFixed(2)}ms`);
  return result;
};

/**
 * 메모리 사용량 측정
 * @returns 메모리 사용량 정보
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100,
    };
  }
  return null;
};

/**
 * 스크롤 성능 최적화를 위한 패시브 이벤트 리스너
 * @param element 대상 요소
 * @param eventType 이벤트 타입
 * @param handler 이벤트 핸들러
 * @param options 옵션
 */
export const addPassiveEventListener = (
  element: EventTarget,
  eventType: string,
  handler: EventListener,
  options: AddEventListenerOptions = {}
) => {
  const passiveOptions: AddEventListenerOptions = {
    passive: true,
    ...options,
  };
  
  element.addEventListener(eventType, handler, passiveOptions);
  
  return () => {
    element.removeEventListener(eventType, handler, passiveOptions);
  };
}; 