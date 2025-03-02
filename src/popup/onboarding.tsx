import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { OnboardingView } from './components/onboarding-view';
import { useTheme } from './hooks/use-theme';
import './styles.css';

// Add logging functionality
console.log('Onboarding script loaded');

// Add error listener
window.addEventListener('error', (e) => {
  console.error('Onboarding error:', e);
});

const App = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleFinish = () => {
    // Close current tab
    browser.tabs.getCurrent().then(tab => {
      if (tab && tab.id) {
        browser.tabs.remove(tab.id);
      }
    }).catch(error => {
      console.error('Failed to close tab:', error);
      // If unable to close the tab, try to redirect to the extension's popup
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