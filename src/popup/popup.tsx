import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SearchView } from './components/search-view';
import { useTheme } from './hooks/use-theme';
import './styles.css';

const App = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    
    // 在组件挂载后尝试聚焦
    const focusSearchInput = () => {
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput) {
        (searchInput as HTMLInputElement).focus();
      }
    };

    // 立即尝试聚焦
    focusSearchInput();
    
    // 以防第一次尝试失败，再次尝试
    const timeoutId = setTimeout(focusSearchInput, 100);
    
    return () => clearTimeout(timeoutId);
  }, [isDark]);

  return <SearchView />;
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);