import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { SortSettings, TabOpeningSettings } from '../types';
import { 
  getSortSettings, 
  saveSortSettings, 
  DEFAULT_SORT_SETTINGS, 
  getTabOpeningSettings, 
  saveTabOpeningSettings, 
  DEFAULT_TAB_OPENING_SETTINGS
} from '../utils/storage';

interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<SortSettings>(DEFAULT_SORT_SETTINGS);
  const [tabOpeningSettings, setTabOpeningSettings] = useState<TabOpeningSettings>(DEFAULT_TAB_OPENING_SETTINGS);
  const [isMac, setIsMac] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({ name: 'Chrome', shortcutsUrl: 'chrome://extensions/shortcuts' });
  
  
  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getSortSettings();
        setSettings(savedSettings);
        
        const savedTabOpeningSettings = await getTabOpeningSettings();
        setTabOpeningSettings(savedTabOpeningSettings);
        
        // Detect platform
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
        
        // Detect browser and set appropriate shortcuts URL
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('firefox')) {
          setBrowserInfo({
            name: 'Firefox',
            shortcutsUrl: 'about:addons'
          });
        } else if (userAgent.includes('edg/')) {
          setBrowserInfo({
            name: 'Edge',
            shortcutsUrl: 'edge://extensions/shortcuts'
          });
        } else {
          setBrowserInfo({
            name: 'Chrome',
            shortcutsUrl: 'chrome://extensions/shortcuts'
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Change sort method
  const handleMethodChange = async (method: SortSettings['method']) => {
    try {
      const newSettings = { ...settings, method };
      await saveSortSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error changing sort method:', error);
    }
  };
  
  // Change tab opening mode
  const handleTabOpeningModeChange = async (mode: TabOpeningSettings['mode']) => {
    try {
      const newSettings = { ...tabOpeningSettings, mode };
      await saveTabOpeningSettings(newSettings);
      setTabOpeningSettings(newSettings);
    } catch (error) {
      console.error('Error changing tab opening mode:', error);
    }
  };
  
  // Get method description
  const getMethodDescription = (method: SortSettings['method']) => {
    switch (method) {
      case 'smart':
        return 'Automatically sort based on your usage habits, with recent and frequently used items at the top';
      case 'relevance':
        return 'Sort by search match relevance, useful when looking for specific tabs';
      case 'usage':
        return 'Put most frequently used items first, especially those accessed in the last week';
      default:
        return '';
    }
  };
  
  // Get tab opening mode description
  const getModeDescription = (mode: TabOpeningSettings['mode']) => {
    switch (mode) {
      case 'standard':
        return 'Enter opens in current tab, Ctrl/Cmd+Enter opens in new tab (recommended)';
      case 'classic':
        return 'Enter always opens in new tab (original behavior)';
      default:
        return '';
    }
  };
  
  // Open browser shortcuts page
  const openBrowserShortcuts = () => {
    // For all browsers, use their respective URLs
    browser.tabs.create({ url: browserInfo.shortcutsUrl });
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Back"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Settings</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Sort Method</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Choose how search results are sorted to find your tabs faster
        </p>
        <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          {[
            { id: 'smart', label: 'Smart Sort', icon: '✨' },
            { id: 'relevance', label: 'By Relevance', icon: '🔍' },
            { id: 'usage', label: 'By Usage', icon: '🕒' }
          ].map(option => (
            <div key={option.id} className={`p-2 rounded-lg transition-colors ${
              settings.method === option.id 
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
            }`}>
              <label className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  name="sortMethod"
                  value={option.id}
                  checked={settings.method === option.id}
                  onChange={() => handleMethodChange(option.id as SortSettings['method'])}
                  className="mt-1 mr-2"
                />
                <div>
                  <div className="flex items-center">
                    <span className="mr-1">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getMethodDescription(option.id as SortSettings['method'])}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Tab Opening Behavior</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Choose how Enter key opens bookmarks and search results
        </p>
        <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          {[
            { id: 'standard', label: 'Standard Mode', icon: '⚡' },
            { id: 'classic', label: 'Classic Mode', icon: '📋' }
          ].map(option => (
            <div key={option.id} className={`p-2 rounded-lg transition-colors ${
              tabOpeningSettings.mode === option.id 
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
            }`}>
              <label className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  name="tabOpeningMode"
                  value={option.id}
                  checked={tabOpeningSettings.mode === option.id}
                  onChange={() => handleTabOpeningModeChange(option.id as TabOpeningSettings['mode'])}
                  className="mt-1 mr-2"
                />
                <div>
                  <div className="flex items-center">
                    <span className="mr-1">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getModeDescription(option.id as TabOpeningSettings['mode'])}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Keyboard Shortcut</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Customize the keyboard shortcut to activate Smart Tab Switcher
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-start space-x-3 mb-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                To change the keyboard shortcut, use {browserInfo.name}'s extension shortcuts settings. 
                This ensures compatibility and allows you to use any key combination, including Command key on Mac.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              How to customize your shortcut:
            </h5>
            {browserInfo.name === 'Firefox' ? (
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  In Firefox, go to: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">about:addons</span>
                </p>
                <ol className="space-y-1 ml-4">
                  <li>1. Open a new tab and type <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">about:addons</span></li>
                  <li>2. Look for the gear icon (⚙️) in the top right corner</li>
                  <li>3. Click the gear icon and select "Manage Extension Shortcuts"</li>
                  <li>4. Find "Smart Tab Switcher" in the list</li>
                  <li>5. Click in the shortcut input box and press your desired key combination</li>
                </ol>
              </div>
            ) : (
              <>
                <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>1. Click the button below to open {browserInfo.name}'s shortcuts page</li>
                  <li>2. Find "Smart Tab Switcher" in the list</li>
                  <li>3. Click the input box next to it</li>
                  <li>4. Press your desired key combination</li>
                  <li>5. The new shortcut will be saved automatically</li>
                </ol>
              </>
            )}
          </div>
          
          {browserInfo.name !== 'Firefox' && (
            <div className="mt-4 text-center">
              <button
                onClick={openBrowserShortcuts}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Open {browserInfo.name} Shortcuts Settings</span>
              </button>
            </div>
          )}
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current default: <span className="font-mono font-medium">{isMac ? 'Cmd+Shift+K' : 'Alt+T'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 