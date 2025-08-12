import React, { useState, useEffect } from 'react';
import { notionApiService, NotionDatabase, NotionPage } from '../../../commons/apis/notion.api';

interface NotionDatabaseProps {
  databaseId: string;
  title?: string;
}

const NotionDatabase: React.FC<NotionDatabaseProps> = ({ databaseId, title }) => {
  const [database, setDatabase] = useState<NotionDatabase | null>(null);
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        setLoading(true);
        const [databaseData, pagesData] = await Promise.all([
          notionApiService.getDatabase(databaseId),
          notionApiService.queryDatabase(databaseId)
        ]);
        
        setDatabase(databaseData);
        setPages(pagesData.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터베이스를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDatabase();
  }, [databaseId]);

  if (loading) {
    return <div className="flex justify-center items-center p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">오류: {error}</div>;
  }

  if (!database) {
    return <div className="p-4">데이터베이스를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {title || (database.title?.[0]?.plain_text || 'Notion 데이터베이스')}
      </h2>
      
      <div className="grid gap-4">
        {pages.map((page) => (
          <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">
              {page.properties?.title?.title?.[0]?.plain_text || 
               page.properties?.Name?.title?.[0]?.plain_text || 
               '제목 없음'}
            </h3>
            <div className="text-sm text-gray-600">
              생성일: {new Date(page.created_time).toLocaleDateString('ko-KR')}
            </div>
            <div className="text-sm text-gray-600">
              수정일: {new Date(page.last_edited_time).toLocaleDateString('ko-KR')}
            </div>
            <a 
              href={page.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
            >
              Notion에서 보기 →
            </a>
          </div>
        ))}
      </div>
      
      {pages.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          데이터베이스에 항목이 없습니다.
        </div>
      )}
    </div>
  );
};

export default NotionDatabase; 