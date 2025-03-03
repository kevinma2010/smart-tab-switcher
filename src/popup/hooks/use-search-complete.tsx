import { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import { SearchResult, TabInfo, BookmarkInfo, SearchOptions, SortSettings, TabUsageData } from '../types';
import { isValidUrl } from '../utils/url';
import browser from 'webextension-polyfill';
import * as psl from 'psl';
import { recordTabAccess, getSortSettings, getUsageData } from '../utils/storage';
import { sortResults } from '../utils/sort';

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
  const [sortSettings, setSortSettings] = useState<SortSettings>({
    method: 'relevance',
    weights: { relevance: 60, frequency: 20, recency: 20 }
  });
  const [usageData, setUsageData] = useState<TabUsageData>({});
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);

  // Load sorting settings and usage data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getSortSettings();
        setSortSettings(settings);
        
        const usage = await getUsageData();
        setUsageData(usage);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Load tabs and bookmarks
  useEffect(() => {
    const loadData = async () => {
      const [loadedTabs, loadedBookmarks, currentTabs] = await Promise.all([
        browser.tabs.query({}),
        browser.bookmarks.search({}),
        browser.tabs.query({ active: true, currentWindow: true })
      ]);

      // Save current tab ID
      if (currentTabs[0]?.id) {
        setCurrentTabId(currentTabs[0].id);
      }

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

  // Get current tab
  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        const popupTab = await browser.tabs.getCurrent();
        if (popupTab) {
          const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
          setCurrentTabId(activeTab?.id || null);
        }
      } catch (error) {
        console.error('Error getting current tab:', error);
      }
    };
    
    getCurrentTab();
  }, []);

  const search = useCallback((searchQuery: string, options: SearchOptions = {}) => {
    const {
      includeBookmarks = true,
      includeTabs = true,
      limit = 10
    } = options;

    const results: SearchResult[] = [];
    
    // Normalize URL by removing trailing slash
    const normalizeUrl = (url: string) => url.replace(/\/$/, '');
    
    // Check if query could be a domain
    const cleanQuery = searchQuery.toLowerCase().trim();
    const isPotentialDomain = cleanQuery.includes('.') && psl.isValid(cleanQuery);
    const potentialUrl = searchQuery.startsWith('http') ? searchQuery : `https://${searchQuery}`;
    
    // Search tabs and bookmarks first
    const urlMap = new Map<string, SearchResult>();

    if (!searchQuery.trim()) {
      // When there is no search keyword, display all tabs (except the current tab), but still apply sorting
      tabs.forEach(tab => {
        if (tab.id !== currentTabId) {
          urlMap.set(normalizeUrl(tab.url), {
            ...tab,
            type: 'tab' as const,
            id: String(tab.id)
          });
        }
      });
    } else {
      // Search tabs
      if (includeTabs) {
        // Filter out the current tab before searching
        const searchableTabs = tabs;
        const tabsFuse = new Fuse(searchableTabs, SEARCH_OPTIONS);
        const tabResults = tabsFuse.search(searchQuery);
        tabResults.forEach(({ item, score = 1 }) => {
          // Only filter out the current tab when displaying results
          if (item.id !== currentTabId) {
            urlMap.set(normalizeUrl(item.url), {
              ...item,
              id: String(item.id),
              type: 'tab' as const
            });
          }
        });
      }

      // Search bookmarks
      if (includeBookmarks) {
        const bookmarksFuse = new Fuse(bookmarks, SEARCH_OPTIONS);
        const bookmarkResults = bookmarksFuse.search(searchQuery);
        bookmarkResults.forEach(({ item, score = 1 }) => {
          const normalizedUrl = normalizeUrl(item.url);
          const existingResult = urlMap.get(normalizedUrl);
          
          // Check if this bookmark has been opened as a tab
          const openTab = tabs.find((tab: TabInfo) => normalizeUrl(tab.url || '') === normalizedUrl);
          
          if (openTab) {
            // If the bookmark has been opened, and there is no result for this URL, or the new score is better
            if (!existingResult || score < (existingResult.score || 1)) {
              urlMap.set(normalizedUrl, {
                ...openTab,
                id: String(openTab.id),
                type: 'tab' as const,
                score
              });
            }
          } else if (!existingResult || score < (existingResult.score || 1)) {
            // If the bookmark has not been opened, keep it as a bookmark type
            urlMap.set(normalizedUrl, {
              ...item,
              type: 'bookmark' as const,
              score
            });
          }
        });
      }

      // Only add URL result if it's a potential domain, valid URL, and URL doesn't exist in results
      if (isPotentialDomain && isValidUrl(searchQuery) && !urlMap.has(normalizeUrl(potentialUrl))) {
        results.push({
          id: 'url-' + searchQuery,
          type: 'url',
          title: 'Open URL',
          url: potentialUrl
        });
      }

      // Add Google search result
      results.push({
        id: 'google-' + searchQuery,
        type: 'google',
        title: `Search Google for "${searchQuery}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
      });
    }

    // Add deduplicated results
    results.push(...urlMap.values());

    // Use sorting algorithm to sort results
    return sortResults(results, sortSettings, usageData).slice(0, limit);
  }, [tabs, bookmarks, usageData, sortSettings, currentTabId]);

  // Update results when query changes
  useEffect(() => {
    const results = search(query);
    setResults(results);
    setSelectedIndex(0);
  }, [query, search]);

  // Record selected result
  const handleSelect = async (result: SearchResult) => {
    try {
      if (result.type === 'tab') {
        // Get current active tab
        const currentTabs = await browser.tabs.query({ active: true, currentWindow: true });
        const currentTab = currentTabs[0];
        
        // Only activate if it's not the current tab
        if (currentTab && parseInt(result.id) !== currentTab.id) {
          // Activation will be handled by the onActivated event
          await browser.tabs.update(parseInt(result.id), { active: true });
        }
        window.close();
      } else if (result.type === 'bookmark' || result.type === 'url' || result.type === 'google') {
        // For new tabs, first record access
        await recordTabAccess(result.url);
        
        // Get the latest usage data
        const updatedUsageData = await getUsageData();
        setUsageData(updatedUsageData);
        
        // Create a new tab
        await browser.tabs.create({ url: result.url });
        window.close();
      }
    } catch (error) {
      console.error('Error handling selection:', error);
    }
  };

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    tabs,
    bookmarks,
    handleSelect,
    sortSettings
  };
};
