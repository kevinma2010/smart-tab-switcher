import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import { SearchResult, TabInfo, BookmarkInfo, SearchOptions, SearchMode, SortSettings, TabUsageData, OpeningMode, TabOpeningSettings } from '../types';
import { isValidUrl } from '../utils/url';
import browser from 'webextension-polyfill';
import * as psl from 'psl';
import { recordTabAccess, getSortSettings, getUsageData, getTabOpeningSettings } from '../utils/storage';
import { sortResults } from '../utils/sort';

const SEARCH_OPTIONS = {
  keys: ['title', 'url'],
  threshold: 0.4,
  includeScore: true,
};

// Parse query for search mode prefixes
function parseQueryForMode(input: string): { mode: SearchMode; cleanQuery: string } {
  const prefixMatch = input.match(/^([bug]):/i);
  
  if (!prefixMatch) {
    return { mode: 'all', cleanQuery: input };
  }
  
  const prefix = prefixMatch[1].toLowerCase();
  const cleanQuery = input.slice(2).trim();
  
  const modeMap: Record<string, SearchMode> = {
    'b': 'bookmarks',
    'u': 'urls', 
    'g': 'google'
  };
  
  return { mode: modeMap[prefix] || 'all', cleanQuery };
}

export const useSearch = () => {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkInfo[]>([]);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('all');
  const [cleanQuery, setCleanQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sortSettings, setSortSettings] = useState<SortSettings>({
    method: 'relevance',
    weights: { relevance: 60, frequency: 20, recency: 20 }
  });
  const [usageData, setUsageData] = useState<TabUsageData>({});
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);
  const [tabOpeningSettings, setTabOpeningSettings] = useState<TabOpeningSettings>({ mode: 'standard' });
  
  // Ref to manage index updates after tab closure
  const postClosureSelectedIndex = React.useRef<number | null>(null);

  // Load sorting settings, usage data, and tab opening settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getSortSettings();
        setSortSettings(settings);
        
        const usage = await getUsageData();
        setUsageData(usage);
        
        const tabSettings = await getTabOpeningSettings();
        setTabOpeningSettings(tabSettings);
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
    
    // Listen for tab closures
    const handleTabRemoved = (tabId: number) => {
      setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
    };
    
    browser.tabs.onRemoved.addListener(handleTabRemoved);
    
    return () => {
      browser.tabs.onRemoved.removeListener(handleTabRemoved);
    };
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

  // Handle query changes with mode parsing
  const handleQueryChange = useCallback((input: string) => {
    const { mode, cleanQuery } = parseQueryForMode(input);
    setSearchMode(mode);
    setCleanQuery(cleanQuery);
    setQuery(input); // Keep original for display
  }, []);

  const search = useCallback((searchQuery: string, options: SearchOptions = {}) => {
    const {
      includeBookmarks = true,
      includeTabs = true,
      limit = 10,
      mode: optionsMode
    } = options;
    
    const currentMode = optionsMode || searchMode;
    const queryToSearch = cleanQuery || searchQuery;

    const results: SearchResult[] = [];
    
    // Handle mode-specific search logic
    if (currentMode === 'google') {
      // Google mode: only return Google search suggestion
      if (!queryToSearch.trim()) return [];
      return [{
        id: 'google-' + queryToSearch,
        type: 'google' as const,
        title: `Search Google for "${queryToSearch}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(queryToSearch)}`
      }];
    }
    
    if (currentMode === 'bookmarks') {
      // Bookmarks mode: only search bookmarks
      if (!queryToSearch.trim()) return [];
      
      const bookmarksFuse = new Fuse(bookmarks, SEARCH_OPTIONS);
      const bookmarkResults = bookmarksFuse.search(queryToSearch);
      
      return bookmarkResults.map(({ item, score = 1 }): SearchResult => ({
        ...item,
        type: 'bookmark' as const,
        score
      })).slice(0, limit);
    }
    
    // Normalize URL by removing trailing slash
    const normalizeUrl = (url: string) => url.replace(/\/$/, '');
    
    // Check if query could be a domain
    const cleanQueryLower = queryToSearch.toLowerCase().trim();
    const isPotentialDomain = cleanQueryLower.includes('.') && psl.isValid(cleanQueryLower);
    const potentialUrl = queryToSearch.startsWith('http') ? queryToSearch : `https://${queryToSearch}`;
    
    // Search tabs and bookmarks first
    const urlMap = new Map<string, SearchResult>();

    if (!queryToSearch.trim()) {
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
      // Search tabs (skip if bookmarks-only mode)
      if (includeTabs && (currentMode === 'all' || currentMode === 'urls')) {
        // Filter out the current tab before searching
        const searchableTabs = tabs;
        const tabsFuse = new Fuse(searchableTabs, SEARCH_OPTIONS);
        const tabResults = tabsFuse.search(queryToSearch);
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

      // Search bookmarks (skip if we're not in all/bookmarks/urls mode)
      if (includeBookmarks && ['all', 'bookmarks', 'urls'].includes(currentMode)) {
        const bookmarksFuse = new Fuse(bookmarks, SEARCH_OPTIONS);
        const bookmarkResults = bookmarksFuse.search(queryToSearch);
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

      // Add URL result based on mode
      if (isPotentialDomain && isValidUrl(queryToSearch) && !urlMap.has(normalizeUrl(potentialUrl))) {
        // Always add in URLs mode, or in all mode if it doesn't exist
        if (currentMode === 'urls' || currentMode === 'all') {
          results.push({
            id: 'url-' + queryToSearch,
            type: 'url' as const,
            title: 'Open URL',
            url: potentialUrl
          });
        }
      }

      // Add Google search result only in all mode
      if (currentMode === 'all') {
        results.push({
          id: 'google-' + queryToSearch,
          type: 'google' as const,
          title: `Search Google for \"${queryToSearch}\" `,
          url: `https://www.google.com/search?q=${encodeURIComponent(queryToSearch)}`
        });
      }
    }

    // Add deduplicated results
    results.push(...urlMap.values());

    // Use sorting algorithm to sort results
    return sortResults(results, sortSettings, usageData).slice(0, limit);
  }, [tabs, bookmarks, usageData, sortSettings, currentTabId, searchMode, cleanQuery]);

  // Update results when query or tabs change
  useEffect(() => {
    const newResults = search(cleanQuery || query);
    setResults(newResults);
    
    // If a post-closure index is set, use it
    if (postClosureSelectedIndex.current !== null) {
      setSelectedIndex(Math.min(postClosureSelectedIndex.current, newResults.length - 1));
      postClosureSelectedIndex.current = null;
    } else {
      // Otherwise, reset to top
      setSelectedIndex(0);
    }
  }, [query, cleanQuery, tabs, search]);

  // Record selected result
  const handleSelect = async (result: SearchResult, openingMode: OpeningMode) => {
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
        // For new content, first record access
        await recordTabAccess(result.url);
        
        // Get the latest usage data
        const updatedUsageData = await getUsageData();
        setUsageData(updatedUsageData);
        
        // Determine where to open based on mode and settings
        const shouldOpenInCurrentTab = determineShouldOpenInCurrentTab(openingMode, tabOpeningSettings);
        
        if (shouldOpenInCurrentTab) {
          // Update current tab
          const currentTabs = await browser.tabs.query({ active: true, currentWindow: true });
          if (currentTabs[0]) {
            await browser.tabs.update(currentTabs[0].id, { url: result.url });
          }
        } else {
          // Create a new tab
          await browser.tabs.create({ url: result.url });
        }
        window.close();
      }
    } catch (error) {
      console.error('Error handling selection:', error);
    }
  };

  // Helper function to determine opening behavior
  const determineShouldOpenInCurrentTab = (mode: OpeningMode, settings: TabOpeningSettings): boolean => {
    if (settings.mode === 'classic') {
      // Classic mode: Enter always opens in new tab, Ctrl+Enter not applicable (current behavior)
      return false;
    } else {
      // Standard mode: Enter opens in current tab, Ctrl+Enter opens in new tab
      return mode === 'current';
    }
  };

  // Close a tab
  const closeTab = useCallback(async (tabId: string) => {
    try {
      const tabIdNum = parseInt(tabId);
      
      // Calculate the new selected index *before* closing the tab
      const closedTabIndex = results.findIndex(r => r.id === tabId);
      let newSelectedIndex = selectedIndex;

      if (closedTabIndex !== -1) {
        const remainingCount = results.length - 1; // Number of items after removal
        
        if (closedTabIndex < selectedIndex) {
          // Closed tab was before the selected item, adjust index down
          newSelectedIndex = Math.max(0, selectedIndex - 1);
        } else if (closedTabIndex === selectedIndex) {
          // Closed tab was the selected item
          if (remainingCount === 0) {
            // No items left, reset to 0
            newSelectedIndex = 0;
          } else if (selectedIndex >= remainingCount) {
            // Selected index would be out of bounds, select the last item
            newSelectedIndex = remainingCount - 1;
          } else {
            // Keep current index (next item will take this position)
            newSelectedIndex = selectedIndex;
          }
        }
        // If closedTabIndex > selectedIndex, no adjustment needed
      }
      
      // Store the calculated index in the ref
      postClosureSelectedIndex.current = newSelectedIndex;
      
      // Asynchronously close the tab. This will trigger the `onRemoved` listener
      // and cause a state update for `tabs`, which will then run the `useEffect`.
      await browser.tabs.remove(tabIdNum);
      
    } catch (error) {
      console.error('Error closing tab:', error);
      postClosureSelectedIndex.current = null; // Clear ref on error
    }
  }, [results, selectedIndex]);

  return {
    query,
    setQuery: handleQueryChange,
    results,
    selectedIndex,
    setSelectedIndex,
    tabs,
    bookmarks,
    handleSelect,
    sortSettings,
    closeTab
  };
};