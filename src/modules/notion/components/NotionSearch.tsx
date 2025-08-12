import React, { useState } from 'react';
import { notionApiService, NotionPage, NotionDatabase } from '../../../commons/apis/notion.api';

interface NotionSearchProps {
  onSelect?: (item: NotionPage | NotionDatabase) => void;
}

const NotionSearch: React.FC<NotionSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(NotionPage | NotionDatabase)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleItemClick = (item: NotionPage | NotionDatabase) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const getItemTitle = (item: NotionPage | NotionDatabase) => {
    if ('properties' in item) {
      return item.properties?.title?.title?.[0]?.plain_text || 
             item.properties?.Name?.title?.[0]?.plain_text || 
             '제목 없음';
    }
    return '제목 없음';
  };

  const getItemType = (item: NotionPage | NotionDatabase) => {
    return 'url' in item ? '페이지' : '데이터베이스';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Notion 검색</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">검색 결과</h3>
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{getItemTitle(item)}</h4>
                  <p className="text-sm text-gray-600">{getItemType(item)}</p>
                  <p className="text-xs text-gray-500">
                    생성일: {new Date(item.created_time).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                {('url' in item) && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    보기 →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && results.length === 0 && query && (
        <div className="text-gray-500 text-center py-8">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default NotionSearch; 