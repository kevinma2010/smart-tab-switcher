import React, { useState, useEffect } from 'react';
import { SortSettings } from '../types';
import { getSortSettings, saveSortSettings, DEFAULT_SORT_SETTINGS } from '../utils/storage';

interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<SortSettings>(DEFAULT_SORT_SETTINGS);
  
  // 加载设置
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
  
  // 更改排序方法
  const handleMethodChange = async (method: SortSettings['method']) => {
    try {
      const newSettings = { ...settings, method };
      await saveSortSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error changing sort method:', error);
    }
  };
  
  // 获取排序方法的描述
  const getMethodDescription = (method: SortSettings['method']) => {
    switch (method) {
      case 'smart':
        return '自动根据你的使用习惯排序，最近和常用的会排在前面';
      case 'relevance':
        return '根据搜索内容的匹配程度排序，找特定标签页时很有用';
      case 'usage':
        return '把最常用的排在前面，特别是最近一周访问过的';
      default:
        return '';
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="返回"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">设置</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">排序方式</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          选择搜索结果的排序方式，以便更快找到您需要的标签页
        </p>
        <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          {[
            { id: 'smart', label: '智能排序', icon: '✨' },
            { id: 'relevance', label: '按相关度', icon: '🔍' },
            { id: 'usage', label: '按使用记录', icon: '🕒' }
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
    </div>
  );
}; 