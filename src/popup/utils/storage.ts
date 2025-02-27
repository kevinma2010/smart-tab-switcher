import browser from 'webextension-polyfill';

// Sort settings type definition
export interface SortSettings {
  method: 'smart' | 'relevance' | 'usage';
  weights?: {  // Optional, only used for smart sorting
    relevance: number;
    frequency: number;
    recency: number;
  };
}

// Tab usage data type definition
export interface TabUsageData {
  [tabUrl: string]: {
    accessCount: number;
    lastAccessed: number; // timestamp
  };
}

// Default sort settings
export const DEFAULT_SORT_SETTINGS: SortSettings = {
  method: 'smart',
  weights: {
    relevance: 60,
    frequency: 20,
    recency: 20
  }
};

// Check if storage API is available
const isStorageAvailable = () => {
  return typeof browser !== 'undefined' && browser.storage && browser.storage.local;
};

// Save sort settings
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

// Get sort settings
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
    await browser.storage.local.set({ usageData: data });
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
    const result = await browser.storage.local.get('usageData');
    return result.usageData || {};
  } catch (error) {
    console.error('Error getting usage data:', error);
    return {};
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