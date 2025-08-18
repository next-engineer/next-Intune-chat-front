import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createIntersectionObserver } from '../utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 성능 최적화된 이미지 컴포넌트
 * - 지연 로딩 (Lazy Loading)
 * - 플레이스홀더 이미지
 * - 에러 처리 및 폴백 이미지
 * - Intersection Observer를 통한 뷰포트 진입 시 로딩
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVlMmUyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2M1MzUzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  // 이미지 로딩 핸들러
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // 이미지 에러 핸들러
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
    setImageSrc(fallback);
    onError?.();
  }, [fallback, onError]);

  // Intersection Observer 콜백
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    });
  }, []);

  // Intersection Observer 설정
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      const observer = createIntersectionObserver(handleIntersection, {
        rootMargin: '50px',
        threshold: 0.1,
      });

      observer.observe(imgRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [loading, handleIntersection]);

  // 뷰포트에 진입했을 때 실제 이미지 로딩
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      setImageSrc(src);
    }
  }, [isInView, src, isLoaded, hasError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading={loading}
    />
  );
};

export default React.memo(OptimizedImage);
