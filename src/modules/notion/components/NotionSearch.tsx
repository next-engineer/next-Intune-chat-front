import React, { useState, useCallback, useMemo } from 'react';
import { debounce } from '../../../utils';
import { notionApiService } from '../apis';
import { NotionPage, NotionDatabase } from '../types';

interface NotionSearchProps {
  onSelect?: (item: NotionPage | NotionDatabase) => void;
}

// 메모이제이션된 검색 결과 아이템 컴포넌트
const SearchResultItem = React.memo<{
  item: NotionPage | NotionDatabase;
  onClick: (item: NotionPage | NotionDatabase) => void;
}>(({ item, onClick }) => {
  const title = useMemo(() => {
    if ('properties' in item) {
      return item.properties?.title?.title?.[0]?.plain_text || 
             item.properties?.Name?.title?.[0]?.plain_text || 
             '제목 없음';
    }
    return '제목 없음';
  }, [item]);

  const type = useMemo(() => {
    return 'url' in item ? '페이지' : '데이터베이스';
  }, [item]);

  return (
    <div
      className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(item)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <div className="text-xs text-gray-400 ml-2">
          {type === '페이지' ? '📄' : '🗃️'}
        </div>
      </div>
    </div>
  );
});

const NotionSearch: React.FC<NotionSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(NotionPage | NotionDatabase)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 디바운스된 검색 함수
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchResults = await notionApiService.search(searchQuery);
        setResults(searchResults.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300), // 300ms 디바운스
    []
  );

  // 검색 핸들러
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  }, [debouncedSearch]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // 아이템 클릭 핸들러
  const handleItemClick = useCallback((item: NotionPage | NotionDatabase) => {
    if (onSelect) {
      onSelect(item);
    }
  }, [onSelect]);

  // 입력 변경 핸들러
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  }, [handleSearch]);

  // 메모이제이션된 검색 결과
  const searchResults = useMemo(() => {
    if (loading) {
      return (
        <div className="p-4 text-center text-gray-500">
          검색 중...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center text-red-500">
          {error}
        </div>
      );
    }

    if (results.length === 0 && query.trim()) {
      return (
        <div className="p-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      );
    }

    return (
      <div className="max-h-96 overflow-y-auto">
        {results.map((item, index) => (
          <SearchResultItem
            key={`${item.id || index}`}
            item={item}
            onClick={handleItemClick}
          />
        ))}
      </div>
    );
  }, [loading, error, results, query, handleItemClick]);

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Notion 페이지나 데이터베이스를 검색하세요..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* 검색 결과 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {searchResults}
      </div>
    </div>
  );
};

export default React.memo(NotionSearch); 