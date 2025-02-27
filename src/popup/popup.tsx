import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SearchView } from './components/search-view';
import { SettingsView } from './components/settings-view';
import { useTheme } from './hooks/use-theme';
import './styles.css';

// 添加日志功能
console.log('Popup script loaded');

// 添加错误监听
window.addEventListener('error', (e) => {
  console.error('Popup error:', e);
});

const App = () => {
  const { isDark } = useTheme();
  const [view, setView] = useState<'search' | 'settings'>('search');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    
    // 在组件挂载后尝试聚焦
    const focusSearchInput = () => {
      if (view === 'search') {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }
    };

    // 立即尝试聚焦
    focusSearchInput();
    
    // 以防第一次尝试失败，再次尝试
    const timeoutId = setTimeout(focusSearchInput, 100);
    
    return () => clearTimeout(timeoutId);
  }, [isDark, view]);

  // 添加 DOMContentLoaded 和 load 事件的日志
  useEffect(() => {
    console.log('React App mounted');
    
    // 由于 React 组件挂载时，DOMContentLoaded 事件可能已经触发，所以这里只记录 load 事件
    if (document.readyState === 'complete') {
      console.log('Popup fully loaded (already)');
    } else {
      window.addEventListener('load', () => {
        console.log('Popup fully loaded');
      });
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {view === 'search' ? (
        <SearchView onOpenSettings={() => setView('settings')} />
      ) : (
        <SettingsView onBack={() => setView('search')} />
      )}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);