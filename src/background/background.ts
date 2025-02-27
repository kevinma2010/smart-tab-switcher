import browser from 'webextension-polyfill';
import { TabUsageData } from '../popup/types';
import { getUsageData, saveUsageData, recordTabAccess } from '../popup/utils/storage';

console.log('Background script loaded');

// Listen for keyboard shortcuts
browser.commands.onCommand.addListener(async (command) => {
  console.log('Command received:', command);
  if (command === '_execute_action') {
    console.log('Trying to open popup');
    try {
      await browser.action.openPopup();
    } catch (error) {
      console.error('Error opening popup:', error);
    }
  }
});

// Maintain tab index cache
let tabsCache = new Map();
// Record recent access times to avoid duplicate records
let lastAccessTimes = new Map<string, number>();

// Initialize tab cache
async function initTabsCache() {
  const tabs = await browser.tabs.query({});
  tabsCache.clear();
  lastAccessTimes.clear();
  tabs.forEach(tab => {
    if (tab.id) {
      tabsCache.set(tab.id, {
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favicon: tab.favIconUrl
      });
    }
  });
}

// Check if access should be recorded (avoid duplicate records in short time)
const shouldRecordAccess = (url: string): boolean => {
  if (!url || url === 'about:blank' || url.startsWith('chrome://')) {
    return false;
  }
  
  const now = Date.now();
  const lastAccess = lastAccessTimes.get(url);
  // Don't record if less than 1 second since last record
  if (lastAccess && now - lastAccess < 1000) {
    return false;
  }
  
  lastAccessTimes.set(url, now);
  return true;
};

// Monitor tab changes
browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.id) {
    tabsCache.set(tab.id, {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl
    });
  }
  
  // Only record when URL exists and is not a blank page
  if (tab.url && shouldRecordAccess(tab.url)) {
    await recordTabAccess(tab.url);
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  tabsCache.delete(tabId);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabsCache.has(tabId)) {
    tabsCache.set(tabId, {
      id: tabId,
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl
    });
  }
  
  // Record access when tab completes loading and URL changes
  if (changeInfo.status === 'complete' && changeInfo.url && shouldRecordAccess(changeInfo.url)) {
    recordTabAccess(changeInfo.url);
  }
});

// Monitor tab activation events to record usage data
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url && shouldRecordAccess(tab.url)) {
    await recordTabAccess(tab.url);
  }
});

// Handle extension installation and updates
browser.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log('Extension installed/updated:', reason);
  if (reason === 'install') {
    // Logic for first installation
    console.log('Quick Tab Switcher installed');
    await initTabsCache();
  } else if (reason === 'update') {
    // Logic for updates
    console.log('Quick Tab Switcher updated');
    await initTabsCache();
  }
});
