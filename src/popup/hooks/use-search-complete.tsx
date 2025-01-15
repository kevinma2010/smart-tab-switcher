import { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import { SearchResult, TabInfo, BookmarkInfo, SearchOptions } from '../types';
import { isValidUrl } from '../utils/url';
import browser from 'webextension-polyfill';

const SEARCH_OPTIONS = {
  keys: ['title', 'url'],
  threshold: 0.4,
  includeScore: true,
};

export const useSearch = () => {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkInfo[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load tabs and bookmarks
  useEffect(() => {
    const loadData = async () => {
      const [loadedTabs, loadedBookmarks] = await Promise.all([
        browser.tabs.query({}),
        browser.bookmarks.search({})
      ]);

      setTabs(loadedTabs.map(tab => ({
        id: tab.id!,
        title: tab.title || '',
        url: tab.url || '',
        favicon: tab.favIconUrl
      })));

      setBookmarks(loadedBookmarks.filter(b => b.url).map(bookmark => ({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url!,
        dateAdded: bookmark.dateAdded || 0
      })));
    };

    loadData();
  }, []);

  const search = useCallback((searchQuery: string, options: SearchOptions = {}) => {
    const {
      includeBookmarks = true,
      includeTabs = true,
      limit = 10
    } = options;

    if (!searchQuery.trim()) {
      // Show all tabs when no query
      return tabs.map(tab => ({
        ...tab,
        type: 'tab' as const,
        id: String(tab.id)
      }));
    }

    const results: SearchResult[] = [];
    
    // Add URL result if query looks like a URL
    if (isValidUrl(searchQuery)) {
      results.push({
        id: 'url-' + searchQuery,
        type: 'url',
        title: 'Open URL',
        url: searchQuery.startsWith('http') ? searchQuery : `https://${searchQuery}`
      });
    }

    // Add Google search result
    results.push({
      id: 'google-' + searchQuery,
      type: 'google',
      title: `Search Google for "${searchQuery}"`,
      url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
    });

    // Search tabs
    if (includeTabs) {
      const tabsFuse = new Fuse(tabs, SEARCH_OPTIONS);
      const tabResults = tabsFuse.search(searchQuery);
      results.push(...tabResults.map(({ item, score = 1 }) => ({
        ...item,
        id: String(item.id),
        type: 'tab' as const,
        score
      })));
    }

    // Search bookmarks
    if (includeBookmarks) {
      const bookmarksFuse = new Fuse(bookmarks, SEARCH_OPTIONS);
      const bookmarkResults = bookmarksFuse.search(searchQuery);
      results.push(...bookmarkResults.map(({ item, score = 1 }) => ({
        ...item,
        type: 'bookmark' as const,
        score
      })));
    }

    // Sort results by score and limit
    return results
      .sort((a, b) => (a.score || 1) - (b.score || 1))
      .slice(0, limit);
  }, [tabs, bookmarks]);

  // Update results when query changes
  useEffect(() => {
    const results = search(query);
    setResults(results);
    setSelectedIndex(0);
  }, [query, search]);

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    tabs,
    bookmarks
  };
};
