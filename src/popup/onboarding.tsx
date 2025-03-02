import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { OnboardingView } from './components/onboarding-view';
import { useTheme } from './hooks/use-theme';
import './styles.css';

// 添加日志功能
console.log('Onboarding script loaded');

// 添加错误监听器
window.addEventListener('error', (e) => {
  console.error('Onboarding error:', e);
});

const App = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleFinish = () => {
    // 关闭当前标签页
    browser.tabs.getCurrent().then(tab => {
      if (tab && tab.id) {
        browser.tabs.remove(tab.id);
      }
    }).catch(error => {
      console.error('关闭标签页失败:', error);
      // 如果无法关闭标签页，尝试重定向到扩展的弹出页面
      window.close();
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <OnboardingView onFinish={handleFinish} />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root element not found');
} 