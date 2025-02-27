import browser from 'webextension-polyfill';

console.log('Background script loaded');

// 导入存储工具函数
import { recordTabAccess, cleanupUsageData } from '../popup/utils/storage';

// 监听快捷键命令
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

// 维护标签页索引缓存
let tabsCache = new Map();
// 记录最近的访问时间，用于避免重复记录
let lastAccessTimes = new Map<string, number>();

// 初始化标签页缓存
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

// 检查是否应该记录访问（避免短时间内重复记录）
const shouldRecordAccess = (url: string): boolean => {
  if (!url || url === 'about:blank' || url.startsWith('chrome://')) {
    return false;
  }
  
  const now = Date.now();
  const lastAccess = lastAccessTimes.get(url);
  // 如果距离上次记录不足1秒，不重复记录
  if (lastAccess && now - lastAccess < 1000) {
    return false;
  }
  
  lastAccessTimes.set(url, now);
  return true;
};

// 监听标签页变化
browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.id) {
    tabsCache.set(tab.id, {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl
    });
  }
  
  // 只有当URL存在且不是空白页时才记录
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
  
  // 当标签页完成加载且URL改变时记录访问
  if (changeInfo.status === 'complete' && changeInfo.url && shouldRecordAccess(changeInfo.url)) {
    recordTabAccess(changeInfo.url);
  }
});

// 监听标签页激活事件，记录访问数据
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url && shouldRecordAccess(tab.url)) {
    await recordTabAccess(tab.url);
  }
});

// 初始化缓存
initTabsCache();

// 创建定期清理数据的定时任务
browser.alarms.create('cleanupUsageData', { periodInMinutes: 60 * 24 }); // 每天清理一次

// 监听定时任务
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanupUsageData') {
    cleanupUsageData();
  }
});

// 处理插件安装和更新
browser.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log('Extension installed/updated:', reason);
  if (reason === 'install') {
    // 首次安装时的逻辑
    console.log('Quick Tab Switcher installed');
    await initTabsCache();
    
    // 创建定时清理任务
    browser.alarms.create('cleanupUsageData', { periodInMinutes: 60 * 24 });
  } else if (reason === 'update') {
    // 更新时的逻辑
    console.log('Quick Tab Switcher updated');
    await initTabsCache();
    
    // 确保定时清理任务存在
    browser.alarms.create('cleanupUsageData', { periodInMinutes: 60 * 24 });
  }
});
