import React, { useState, useEffect } from 'react';
import { notionApiService, NotionPage, NotionBlock } from '../../../commons/apis/notion.api';

interface NotionPageProps {
  pageId: string;
  title?: string;
}

const NotionPage: React.FC<NotionPageProps> = ({ pageId, title }) => {
  const [page, setPage] = useState<NotionPage | null>(null);
  const [blocks, setBlocks] = useState<NotionBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const [pageData, blocksData] = await Promise.all([
          notionApiService.getPage(pageId),
          notionApiService.getBlocks(pageId)
        ]);
        
        setPage(pageData);
        setBlocks(blocksData.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : '페이지를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  const renderBlock = (block: NotionBlock) => {
    const { type, content } = block;
    
    switch (type) {
      case 'paragraph':
        return (
          <p key={block.id} className="mb-4">
            {content?.rich_text?.map((text: any, index: number) => (
              <span key={index} className={text.annotations?.bold ? 'font-bold' : ''}>
                {text.plain_text}
              </span>
            ))}
          </p>
        );
      
      case 'heading_1':
        return (
          <h1 key={block.id} className="text-3xl font-bold mb-4">
            {content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}
          </h1>
        );
      
      case 'heading_2':
        return (
          <h2 key={block.id} className="text-2xl font-bold mb-3">
            {content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}
          </h2>
        );
      
      case 'heading_3':
        return (
          <h3 key={block.id} className="text-xl font-bold mb-2">
            {content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}
          </h3>
        );
      
      case 'bulleted_list_item':
        return (
          <li key={block.id} className="ml-4 mb-1">
            {content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}
          </li>
        );
      
      case 'numbered_list_item':
        return (
          <li key={block.id} className="ml-4 mb-1">
            {content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}
          </li>
        );
      
      case 'code':
        return (
          <pre key={block.id} className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <code>{content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}</code>
          </pre>
        );
      
      case 'quote':
        return (
          <blockquote key={block.id} className="border-l-4 border-gray-300 pl-4 mb-4 italic">
            {content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}
          </blockquote>
        );
      
      default:
        return (
          <div key={block.id} className="mb-4">
            {content?.rich_text?.map((text: any, index: number) => text.plain_text).join('')}
          </div>
        );
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">오류: {error}</div>;
  }

  if (!page) {
    return <div className="p-4">페이지를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-6">
        {title || (page.properties?.title?.title?.[0]?.plain_text || 'Notion 페이지')}
      </h1>
      
      <div className="text-sm text-gray-600 mb-6">
        <div>생성일: {new Date(page.created_time).toLocaleDateString('ko-KR')}</div>
        <div>수정일: {new Date(page.last_edited_time).toLocaleDateString('ko-KR')}</div>
      </div>
      
      <div className="prose max-w-none">
        {blocks.map(renderBlock)}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <a 
          href={page.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          Notion에서 보기 →
        </a>
      </div>
    </div>
  );
};

export default NotionPage; 