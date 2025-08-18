import axios, { AxiosInstance } from 'axios';
import { API_ENDPOINTS } from '../../constants/endPoint.constants';
import { config } from '../../constants/config';

// Notion API 인터페이스 정의
export interface INotionApiClient {
  getDatabase(databaseId: string): Promise<NotionDatabase>;
  queryDatabase(databaseId: string, filter?: any, sorts?: any[]): Promise<{ results: NotionPage[] }>;
  getPage(pageId: string): Promise<NotionPage>;
  createPage(parent: { database_id?: string; page_id?: string }, properties: Record<string, any>): Promise<NotionPage>;
  updatePage(pageId: string, properties: Record<string, any>): Promise<NotionPage>;
  getBlocks(blockId: string): Promise<{ results: NotionBlock[] }>;
  appendBlocks(blockId: string, children: NotionBlock[]): Promise<{ results: NotionBlock[] }>;
  search(query?: string, filter?: any, sorts?: any[]): Promise<{ results: (NotionPage | NotionDatabase)[] }>;
}

// Notion API 설정 인터페이스
export interface INotionApiConfig {
  baseURL: string;
  timeout: number;
  apiKey: string;
  version: string;
}

// Notion Rich Text 인터페이스
export interface NotionRichText {
  type: string;
  text: {
    content: string;
    link: string | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

// Notion API 인터페이스 정의
export interface NotionDatabase {
  id: string;
  title: NotionRichText[];
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
}

export interface NotionPage {
  id: string;
  title: NotionRichText[];
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

// Notion API 구현체
export class NotionApiClient implements INotionApiClient {
  private axiosInstance: AxiosInstance;

  constructor(config: INotionApiConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Notion-Version': config.version,
        'Content-Type': 'application/json',
      },
    });
  }

  // 데이터베이스 조회
  async getDatabase(databaseId: string): Promise<NotionDatabase> {
    const response = await this.axiosInstance.get(`${API_ENDPOINTS.NOTION.DATABASES}/${databaseId}`);
    return response.data;
  }

  // 데이터베이스 쿼리
  async queryDatabase(databaseId: string, filter?: any, sorts?: any[]): Promise<{ results: NotionPage[] }> {
    const response = await this.axiosInstance.post(`${API_ENDPOINTS.NOTION.DATABASES}/${databaseId}/query`, {
      filter,
      sorts,
    });
    return response.data;
  }

  // 페이지 조회
  async getPage(pageId: string): Promise<NotionPage> {
    const response = await this.axiosInstance.get(`${API_ENDPOINTS.NOTION.PAGES}/${pageId}`);
    return response.data;
  }

  // 페이지 생성
  async createPage(parent: { database_id?: string; page_id?: string }, properties: Record<string, any>): Promise<NotionPage> {
    const response = await this.axiosInstance.post(API_ENDPOINTS.NOTION.PAGES, {
      parent,
      properties,
    });
    return response.data;
  }

  // 페이지 업데이트
  async updatePage(pageId: string, properties: Record<string, any>): Promise<NotionPage> {
    const response = await this.axiosInstance.patch(`${API_ENDPOINTS.NOTION.PAGES}/${pageId}`, {
      properties,
    });
    return response.data;
  }

  // 블록 조회
  async getBlocks(blockId: string): Promise<{ results: NotionBlock[] }> {
    const response = await this.axiosInstance.get(`${API_ENDPOINTS.NOTION.BLOCKS}/${blockId}/children`);
    return response.data;
  }

  // 블록 추가
  async appendBlocks(blockId: string, children: NotionBlock[]): Promise<{ results: NotionBlock[] }> {
    const response = await this.axiosInstance.patch(`${API_ENDPOINTS.NOTION.BLOCKS}/${blockId}/children`, {
      children,
    });
    return response.data;
  }

  // 검색
  async search(query?: string, filter?: any, sorts?: any[]): Promise<{ results: (NotionPage | NotionDatabase)[] }> {
    const response = await this.axiosInstance.post(API_ENDPOINTS.NOTION.SEARCH, {
      query,
      filter,
      sorts,
    });
    return response.data;
  }
}

// Notion API 서비스 팩토리
export class NotionApiServiceFactory {
  static create(apiConfig?: Partial<INotionApiConfig>): INotionApiClient {
    const defaultConfig: INotionApiConfig = {
      baseURL: API_ENDPOINTS.NOTION.BASE_URL,
      timeout: 10000,
      apiKey: apiConfig?.apiKey || config.NOTION_API_KEY,
      version: '2022-06-28',
    };

    const finalConfig = { ...defaultConfig, ...apiConfig };
    return new NotionApiClient(finalConfig);
  }
}

// 기본 인스턴스 생성 (기존 코드와의 호환성을 위해)
export const notionApiService = NotionApiServiceFactory.create({
  apiKey: config.NOTION_API_KEY,
});

export default notionApiService; 