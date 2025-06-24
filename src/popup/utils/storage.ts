import browser from 'webextension-polyfill';
import { TabOpeningSettings } from '../types';

// Check if storage API is available
const isStorageAvailable = () => {
  return browser && browser.storage && browser.storage.local;
};

// Sorting settings type definition
export interface SortSettings {
  method: 'smart' | 'relevance' | 'usage';
  weights?: {  // Set to optional because only smart sorting will use it
    relevance: number;
    frequency: number;
    recency: number;
  };
}

// Tab usage data type definition
export interface TabUsageData {
  [tabUrl: string]: {
    accessCount: number;
    lastAccessed: number; // Timestamp
  };
}

// Default settings
export const DEFAULT_SORT_SETTINGS: SortSettings = {
  method: 'smart'
};

export const DEFAULT_TAB_OPENING_SETTINGS: TabOpeningSettings = {
  mode: 'standard'
};

// Data cleanup settings
export const USAGE_DATA_MAX_ITEMS = 1000; // Maximum number of stored items
export const USAGE_DATA_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days, in milliseconds

// Save sorting settings
export const saveSortSettings = async (settings: SortSettings): Promise<void> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return;
  }
  
  try {
    await browser.storage.local.set({ sortSettings: settings });
  } catch (error) {
    console.error('Error saving sort settings:', error);
  }
};

// Get sorting settings
export const getSortSettings = async (): Promise<SortSettings> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return DEFAULT_SORT_SETTINGS;
  }
  
  try {
    const result = await browser.storage.local.get('sortSettings');
    return result.sortSettings || DEFAULT_SORT_SETTINGS;
  } catch (error) {
    console.error('Error getting sort settings:', error);
    return DEFAULT_SORT_SETTINGS;
  }
};

// Save usage data
export const saveUsageData = async (data: TabUsageData): Promise<void> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return;
  }
  
  try {
    await browser.storage.local.set({ tabUsageData: data });
  } catch (error) {
    console.error('Error saving usage data:', error);
  }
};

// Get usage data
export const getUsageData = async (): Promise<TabUsageData> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return {};
  }
  
  try {
    const result = await browser.storage.local.get('tabUsageData');
    return result.tabUsageData || {};
  } catch (error) {
    console.error('Error getting usage data:', error);
    return {};
  }
};

// Clean up expired data
export const cleanupUsageData = async (): Promise<void> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return;
  }
  
  try {
    const data = await getUsageData();
    const now = Date.now();
    
    // Delete expired data
    Object.keys(data).forEach(url => {
      if (now - data[url].lastAccessed > USAGE_DATA_MAX_AGE) {
        delete data[url];
      }
    });
    
    // If the data is too large, delete the least used items
    if (Object.keys(data).length > USAGE_DATA_MAX_ITEMS) {
      const sortedUrls = Object.keys(data).sort((a, b) => 
        (data[a].accessCount / Math.sqrt(now - data[a].lastAccessed)) - 
        (data[b].accessCount / Math.sqrt(now - data[b].lastAccessed))
      );
      
      const urlsToRemove = sortedUrls.slice(0, sortedUrls.length - USAGE_DATA_MAX_ITEMS);
      urlsToRemove.forEach(url => delete data[url]);
    }
    
    await saveUsageData(data);
  } catch (error) {
    console.error('Error cleaning up usage data:', error);
  }
};

// Record tab access
export const recordTabAccess = async (tabUrl: string): Promise<void> => {
  if (!tabUrl || tabUrl.startsWith('chrome://') || tabUrl.startsWith('about:')) {
    return; // Ignore browser internal pages
  }

  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return;
  }
  
  try {
    const usageData = await getUsageData();
    
    if (!usageData[tabUrl]) {
      usageData[tabUrl] = {
        accessCount: 0,
        lastAccessed: 0
      };
    }
    
    usageData[tabUrl].accessCount += 1;
    usageData[tabUrl].lastAccessed = Date.now();
    
    await saveUsageData(usageData);
  } catch (error) {
    console.error('Error recording tab access:', error);
  }
};

// Save tab opening settings
export const saveTabOpeningSettings = async (settings: TabOpeningSettings): Promise<void> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return;
  }
  
  try {
    await browser.storage.local.set({ tabOpeningSettings: settings });
  } catch (error) {
    console.error('Error saving tab opening settings:', error);
  }
};

// Get tab opening settings
export const getTabOpeningSettings = async (): Promise<TabOpeningSettings> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return DEFAULT_TAB_OPENING_SETTINGS;
  }
  
  try {
    const result = await browser.storage.local.get('tabOpeningSettings');
    return result.tabOpeningSettings || DEFAULT_TAB_OPENING_SETTINGS;
  } catch (error) {
    console.error('Error getting tab opening settings:', error);
    return DEFAULT_TAB_OPENING_SETTINGS;
  }
}; 