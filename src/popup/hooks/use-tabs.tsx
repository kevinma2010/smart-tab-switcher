import { useState, useEffect, useCallback } from 'react';
import browser from 'webextension-polyfill';
import { TabInfo } from '../types';

export const useTabs = () => {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | undefined>();

  // Load initial tabs
  useEffect(() => {
    const loadTabs = async () => {
      const loadedTabs = await browser.tabs.query({});
      const currentTab = await browser.tabs.getCurrent();
      
      setTabs(loadedTabs.map(tab => ({
        id: tab.id!,
        title: tab.title || '',
        url: tab.url || '',
        favicon: tab.favIconUrl
      })));
      
      setActiveTabId(currentTab?.id);
    };

    loadTabs();
    
    // Listen for tab changes
    const handleTabCreated = (tab: browser.Tabs.Tab) => {
      setTabs(prev => [...prev, {
        id: tab.id!,
        title: tab.title || '',
        url: tab.url || '',
        favicon: tab.favIconUrl
      }]);
    };

    const handleTabRemoved = (tabId: number) => {
      setTabs(prev => prev.filter(tab => tab.id !== tabId));
    };

    const handleTabUpdated = (
      tabId: number,
      changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
      tab: browser.Tabs.Tab
    ) => {
      setTabs(prev => prev.map(t => 
        t.id === tabId 
          ? {
              ...t,
              title: tab.title || t.title,
              url: tab.url || t.url,
              favicon: tab.favIconUrl || t.favicon
            }
          : t
      ));
    };

    browser.tabs.onCreated.addListener(handleTabCreated);
    browser.tabs.onRemoved.addListener(handleTabRemoved);
    browser.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      browser.tabs.onCreated.removeListener(handleTabCreated);
      browser.tabs.onRemoved.removeListener(handleTabRemoved);
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, []);

  const switchToTab = useCallback(async (tabId: number) => {
    await browser.tabs.update(tabId, { active: true });
  }, []);

  const createTab = useCallback(async (url: string) => {
    await browser.tabs.create({ url });
  }, []);

  return {
    tabs,
    activeTabId,
    switchToTab,
    createTab
  };
};
