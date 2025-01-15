export interface SearchResult {
  id: string;
  type: 'tab' | 'bookmark' | 'google' | 'url';
  title: string;
  url: string;
  favicon?: string;
  score?: number;
}

export interface TabInfo {
  id: number;
  title: string;
  url: string;
  favicon?: string;
}

export interface BookmarkInfo {
  id: string;
  title: string;
  url: string;
  dateAdded: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  selectedIndex: number;
}

export interface SearchOptions {
  includeBookmarks?: boolean;
  includeTabs?: boolean;
  limit?: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  isDark: boolean;
}