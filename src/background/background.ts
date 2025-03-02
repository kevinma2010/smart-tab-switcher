import browser from 'webextension-polyfill';

console.log('Background script loaded');

// Import storage utility functions
import { recordTabAccess, cleanupUsageData } from '../popup/utils/storage';

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
  // If the last access time is less than 1 second ago, do not record again
  if (lastAccess && now - lastAccess < 1000) {
    return false;
  }
  
  lastAccessTimes.set(url, now);
  return true;
};

// Listen for tab changes
browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.id) {
    tabsCache.set(tab.id, {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl
    });
  }
  
  // Only record access if URL exists and is not blank
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
  
  // Record access when tab finishes loading and URL changes
  if (changeInfo.status === 'complete' && changeInfo.url && shouldRecordAccess(changeInfo.url)) {
    recordTabAccess(changeInfo.url);
  }
});

// Listen for tab activation event, record access data
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url && shouldRecordAccess(tab.url)) {
    await recordTabAccess(tab.url);
  }
});

// Initialize cache
initTabsCache();

// Create scheduled task to clean up data
browser.alarms.create('cleanupUsageData', { periodInMinutes: 60 * 24 }); // Clean up once a day

// Listen for scheduled task
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanupUsageData') {
    cleanupUsageData();
  }
});

// 检查是否应该显示引导页
async function shouldShowOnboarding(): Promise<boolean> {
  try {
    const data = await browser.storage.local.get('onboardingCompleted');
    return !data.onboardingCompleted;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return true; // 如果出错，默认显示引导页
  }
}

// 打开引导页
async function openOnboardingPage() {
  try {
    const onboardingUrl = browser.runtime.getURL('onboarding.html');
    await browser.tabs.create({ url: onboardingUrl });
    console.log('Onboarding page opened');
  } catch (error) {
    console.error('Error opening onboarding page:', error);
  }
}

// Handle plugin installation and update
browser.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log('Extension installed/updated:', reason);
  if (reason === 'install') {
    // Logic for first installation
    console.log('Smart Tab Switcher installed');
    await initTabsCache();
    
    // Create scheduled cleanup task
    browser.alarms.create('cleanupUsageData', { periodInMinutes: 60 * 24 });
    
    // 打开引导页
    await openOnboardingPage();
  } else if (reason === 'update') {
    // Logic for update
    console.log('Smart Tab Switcher updated');
    await initTabsCache();
    
    // Ensure scheduled cleanup task exists
    browser.alarms.create('cleanupUsageData', { periodInMinutes: 60 * 24 });
    
    // 检查是否需要显示引导页（例如，如果是重大更新）
    // 这里我们选择不在更新时显示引导页，但您可以根据需要修改此逻辑
    // const shouldShow = await shouldShowOnboarding();
    // if (shouldShow) {
    //   await openOnboardingPage();
    // }
  }
});
