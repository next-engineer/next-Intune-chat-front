import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/endPoint.constants';

// Notion API 클라이언트 생성
const notionApi = axios.create({
  baseURL: API_ENDPOINTS.NOTION.BASE_URL,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  },
});

// Notion API 인터페이스 정의
export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
}

export interface NotionPage {
  id: string;
  title: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
  url: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  content: any;
  created_time: string;
  last_edited_time: string;
}

// Notion API 함수들
export const notionApiService = {
  // 데이터베이스 조회
  async getDatabase(databaseId: string): Promise<NotionDatabase> {
    const response = await notionApi.get(`${API_ENDPOINTS.NOTION.DATABASES}/${databaseId}`);
    return response.data;
  },

  // 데이터베이스 쿼리
  async queryDatabase(databaseId: string, filter?: any, sorts?: any[]): Promise<{ results: NotionPage[] }> {
    const response = await notionApi.post(`${API_ENDPOINTS.NOTION.DATABASES}/${databaseId}/query`, {
      filter,
      sorts,
    });
    return response.data;
  },

  // 페이지 조회
  async getPage(pageId: string): Promise<NotionPage> {
    const response = await notionApi.get(`${API_ENDPOINTS.NOTION.PAGES}/${pageId}`);
    return response.data;
  },

  // 페이지 생성
  async createPage(parent: { database_id?: string; page_id?: string }, properties: Record<string, any>): Promise<NotionPage> {
    const response = await notionApi.post(API_ENDPOINTS.NOTION.PAGES, {
      parent,
      properties,
    });
    return response.data;
  },

  // 페이지 업데이트
  async updatePage(pageId: string, properties: Record<string, any>): Promise<NotionPage> {
    const response = await notionApi.patch(`${API_ENDPOINTS.NOTION.PAGES}/${pageId}`, {
      properties,
    });
    return response.data;
  },

  // 블록 조회
  async getBlocks(blockId: string): Promise<{ results: NotionBlock[] }> {
    const response = await notionApi.get(`${API_ENDPOINTS.NOTION.BLOCKS}/${blockId}/children`);
    return response.data;
  },

  // 블록 추가
  async appendBlocks(blockId: string, children: NotionBlock[]): Promise<{ results: NotionBlock[] }> {
    const response = await notionApi.patch(`${API_ENDPOINTS.NOTION.BLOCKS}/${blockId}/children`, {
      children,
    });
    return response.data;
  },

  // 검색
  async search(query?: string, filter?: any, sorts?: any[]): Promise<{ results: (NotionPage | NotionDatabase)[] }> {
    const response = await notionApi.post(API_ENDPOINTS.NOTION.SEARCH, {
      query,
      filter,
      sorts,
    });
    return response.data;
  },
};

export default notionApiService; 