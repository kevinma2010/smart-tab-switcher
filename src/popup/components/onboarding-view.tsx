import React from 'react';
import browser from 'webextension-polyfill';

interface OnboardingViewProps {
  onFinish: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onFinish }) => {
  // Determine if user is on Mac or Windows/Linux
  const isMac = navigator.platform.includes('Mac');
  const shortcutKey = isMac ? '⌘+⇧+K' : 'Alt+T';
  
  const handleFinish = () => {
    // Save onboarding completion status to storage
    browser.storage.local.set({ onboardingCompleted: true })
      .then(() => {
        onFinish();
      })
      .catch(error => {
        console.error('Failed to save onboarding status:', error);
        onFinish();
      });
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <img 
          src="../icons/extension/icon-128.png" 
          alt="Smart Tab Switcher Logo" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome to Smart Tab Switcher
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Quickly switch and manage your browser tabs
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Key Features
        </h2>
        
        <div className="mb-6">
          <div className="flex items-start mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">Quick Switching</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use keyboard shortcut <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">{shortcutKey}</span> to quickly open the tab switcher
                {!isMac && <span className="text-xs ml-1">(Windows/Linux)</span>}
                {isMac && <span className="text-xs ml-1">(Mac)</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">Fuzzy Search</h3>
              <p className="text-gray-600 dark:text-gray-300">Type keywords to quickly find the tabs you need, no exact match required</p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">Smart Sorting</h3>
              <p className="text-gray-600 dark:text-gray-300">Automatically prioritizes your most frequently used tabs based on your habits</p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 dark:text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">Query Modes</h3>
              <p className="text-gray-600 dark:text-gray-300">Use prefixes to filter search results: <span className="font-mono text-sm">b:</span> bookmarks, <span className="font-mono text-sm">u:</span> URLs, <span className="font-mono text-sm">g:</span> Google search</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">Customizable Settings</h3>
              <p className="text-gray-600 dark:text-gray-300">Customize appearance and behavior according to your preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          How to Use
        </h2>
        
        <ol className="list-decimal pl-5 space-y-3 text-gray-600 dark:text-gray-300">
          <li>
            Use keyboard shortcut <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">{shortcutKey}</span> 
            {!isMac && <span className="text-xs ml-1">(Windows/Linux)</span>}
            {isMac && <span className="text-xs ml-1">(Mac)</span>} 
            or click the extension icon in the toolbar to open the tab switcher
          </li>
          <li>Type keywords in the search box to find tabs or use prefixes:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">b:react</span> - Search only bookmarks</li>
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">u:github.com</span> - Search tabs/bookmarks with URL suggestions</li>
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">g:tutorial</span> - Direct Google search</li>
            </ul>
          </li>
          <li>
            Use keyboard navigation to browse results:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">↑↓</span> or <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">Tab</span>/<span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">⇧Tab</span> - Navigate between results</li>
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">Enter</span> - Open in current tab</li>
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">{isMac ? '⌘' : 'Ctrl'}+Enter</span> - Open in new tab</li>
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">Del</span> - Close selected tab</li>
              <li><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">Esc</span> - Close switcher</li>
            </ul>
          </li>
          <li>Click the settings icon to customize the extension's behavior and appearance</li>
        </ol>
      </div>

      <button 
        onClick={handleFinish}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
      >
        Get Started
      </button>
    </div>
  );
};

export default OnboardingView; 