import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { SortSettings } from '../types';
import { getSortSettings, saveSortSettings, DEFAULT_SORT_SETTINGS } from '../utils/storage';

interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<SortSettings>(DEFAULT_SORT_SETTINGS);
  
  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getSortSettings();
        setSettings(savedSettings);
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

  // 打开引导页
  const openOnboardingPage = async () => {
    try {
      const onboardingUrl = browser.runtime.getURL('onboarding.html');
      await browser.tabs.create({ url: onboardingUrl });
      window.close(); // 关闭弹出窗口
    } catch (error) {
      console.error('Error opening onboarding page:', error);
    }
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
        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Help & Support</h3>
        <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <button 
            onClick={openOnboardingPage}
            className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium">查看使用指南</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                重新打开引导页面，了解扩展的功能和使用方法
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}; 