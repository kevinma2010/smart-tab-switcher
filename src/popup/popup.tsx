import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SearchView } from './components/search-view';
import { SettingsView } from './components/settings-view';
import { useTheme } from './hooks/use-theme';
import './styles.css';

// Add logging functionality
console.log('Popup script loaded');

// Add error listener
window.addEventListener('error', (e) => {
  console.error('Popup error:', e);
});

const App = () => {
  const { isDark } = useTheme();
  const [view, setView] = useState<'search' | 'settings'>('search');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    
    // Try to focus after component mounts
    const focusSearchInput = () => {
      if (view === 'search') {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }
    };

    // Immediately try to focus
    focusSearchInput();
    
    // In case the first attempt fails, try again
    const timeoutId = setTimeout(focusSearchInput, 100);
    
    return () => clearTimeout(timeoutId);
  }, [isDark, view]);

  // Add logging for DOMContentLoaded and load events
  useEffect(() => {
    console.log('React App mounted');
    
    // Since the React component mounts, the DOMContentLoaded event may have already been triggered, so here we only log the load event
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