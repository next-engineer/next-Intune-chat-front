import React, { useState } from 'react';
import NotionDatabase from './components/NotionDatabase';
import NotionPage from './components/NotionPage';
import NotionSearch from './components/NotionSearch';
import { NotionPage as NotionPageType, NotionDatabase as NotionDatabaseType } from '../../commons/apis/notion.api';

const NotionModule: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<NotionPageType | NotionDatabaseType | null>(null);
  const [view, setView] = useState<'search' | 'database' | 'page'>('search');

  const handleItemSelect = (item: NotionPageType | NotionDatabaseType) => {
    setSelectedItem(item);
    if ('url' in item) {
      setView('page');
    } else {
      setView('database');
    }
  };

  const handleBack = () => {
    setSelectedItem(null);
    setView('search');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Notion 통합</h1>
          <p className="text-gray-600">
            Notion API를 통해 데이터베이스와 페이지를 조회하고 관리할 수 있습니다.
          </p>
        </div>

        {/* 네비게이션 */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => {
                setView('search');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              검색
            </button>
            {selectedItem && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
              >
                뒤로 가기
              </button>
            )}
          </nav>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-md">
          {view === 'search' && (
            <NotionSearch onSelect={handleItemSelect} />
          )}
          
          {view === 'database' && selectedItem && !('url' in selectedItem) && (
            <div className="p-6">
              <NotionDatabase 
                databaseId={selectedItem.id} 
                title={selectedItem.title?.[0]?.plain_text}
              />
            </div>
          )}
          
          {view === 'page' && selectedItem && 'url' in selectedItem && (
            <div className="p-6">
              <NotionPage 
                pageId={selectedItem.id} 
                title={selectedItem.properties?.title?.title?.[0]?.plain_text}
              />
            </div>
          )}
        </div>

        {/* 사용법 안내 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">사용법</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• 검색 탭에서 Notion 페이지나 데이터베이스를 검색할 수 있습니다.</li>
            <li>• 검색 결과를 클릭하면 해당 항목의 상세 내용을 볼 수 있습니다.</li>
            <li>• 데이터베이스의 경우 모든 페이지 목록을 확인할 수 있습니다.</li>
            <li>• 페이지의 경우 모든 블록 내용을 렌더링하여 표시합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotionModule; 