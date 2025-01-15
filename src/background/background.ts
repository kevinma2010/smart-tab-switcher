import browser from 'webextension-polyfill';

console.log('Background script loaded');

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

// 初始化标签页缓存
async function initTabsCache() {
  const tabs = await browser.tabs.query({});
  tabsCache.clear();
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
});

// 初始化缓存
initTabsCache();

// 处理插件安装和更新
browser.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log('Extension installed/updated:', reason);
  if (reason === 'install') {
    // 首次安装时的逻辑
    console.log('Quick Tab Switcher installed');
    await initTabsCache();
  } else if (reason === 'update') {
    // 更新时的逻辑
    console.log('Quick Tab Switcher updated');
    await initTabsCache();
  }
});
