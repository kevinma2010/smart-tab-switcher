import browser from 'webextension-polyfill';

// 检查 storage API 是否可用
const isStorageAvailable = () => {
  return browser && browser.storage && browser.storage.local;
};

// 排序设置类型定义
export interface SortSettings {
  method: 'smart' | 'relevance' | 'usage';
  weights?: {  // 设为可选，因为只有 smart 排序才会用到
    relevance: number;
    frequency: number;
    recency: number;
  };
}

// 标签页使用数据类型定义
export interface TabUsageData {
  [tabUrl: string]: {
    accessCount: number;
    lastAccessed: number; // 时间戳
  };
}

// 默认设置
export const DEFAULT_SORT_SETTINGS: SortSettings = {
  method: 'smart'
};

// 数据清理设置
export const USAGE_DATA_MAX_ITEMS = 1000; // 最大存储项数
export const USAGE_DATA_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30天，单位毫秒

// 保存排序设置
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

// 获取排序设置
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

// 保存使用数据
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

// 获取使用数据
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

// 清理过期数据
export const cleanupUsageData = async (): Promise<void> => {
  if (!isStorageAvailable()) {
    console.error('Storage API is not available');
    return;
  }
  
  try {
    const data = await getUsageData();
    const now = Date.now();
    
    // 删除过期数据
    Object.keys(data).forEach(url => {
      if (now - data[url].lastAccessed > USAGE_DATA_MAX_AGE) {
        delete data[url];
      }
    });
    
    // 如果数据量过大，删除最不常用的项
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

// 记录标签页访问
export const recordTabAccess = async (tabUrl: string): Promise<void> => {
  if (!tabUrl || tabUrl.startsWith('chrome://') || tabUrl.startsWith('about:')) {
    return; // 忽略浏览器内部页面
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