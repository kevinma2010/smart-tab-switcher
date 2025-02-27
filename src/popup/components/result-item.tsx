import React from 'react';
import { SearchResult } from '../types';
import { formatRelativeTime } from '../utils/time';

interface ResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({
  result,
  isSelected,
  onClick,
}) => {
  const getIcon = () => {
    switch (result.type) {
      case 'tab':
        return result.favicon || '/icons/ui/tab.png';
      case 'bookmark':
        return '/icons/ui/bookmark.png';
      case 'google':
        return '/icons/ui/google.png';
      case 'url':
        return '/icons/ui/globe.png';
      default:
        return '/icons/ui/default.png';
    }
  };

  // 显示使用数据（仅对标签页和书签）
  const showUsageData = result.type === 'tab' || result.type === 'bookmark';

  // 生成访问频率星级（0-5星）
  const getFrequencyStars = () => {
    if (!result.accessCount || result.accessCount <= 0) return 0;
    if (result.accessCount >= 10) return 5;  // 经常使用（10次以上）
    if (result.accessCount >= 5) return 4;   // 多次使用（5-9次）
    if (result.accessCount >= 3) return 3;   // 偶尔使用（3-4次）
    if (result.accessCount >= 2) return 2;   // 用过几次（2次）
    return 1;                                // 用过一次
  };

  const frequencyStars = getFrequencyStars();

  // 获取类型标签
  const getTypeLabel = () => {
    switch (result.type) {
      case 'tab':
        return { text: '标签页', bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 'bookmark':
        return { text: '书签', bgColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
      case 'google':
        return { text: '搜索', bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      case 'url':
        return { text: '网址', bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      default:
        return { text: '', bgColor: '' };
    }
  };

  const typeLabel = getTypeLabel();

  return (
    <div
      className={`p-3 flex items-center cursor-pointer border-b border-gray-100 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700
        ${isSelected ? 'bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600' : ''}
        dark:text-gray-100 transition-colors`}
      onClick={onClick}
    >
      <img
        src={getIcon()}
        className="w-6 h-6 mr-3 flex-shrink-0"
        alt=""
      />
      <div className="flex-grow min-w-0">
        <div className="flex items-center mb-1">
          <div className="text-sm font-medium truncate dark:text-gray-100 mr-2">
            {result.title}
          </div>
          <div className={`text-xs px-1.5 py-0.5 rounded-full ${typeLabel.bgColor} flex-shrink-0`}>
            {typeLabel.text}
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="truncate">
            {result.url}
          </div>
        </div>
        {showUsageData && (result.accessCount ?? 0) > 0 && (
          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex mr-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < frequencyStars ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}>
                  ★
                </span>
              ))}
            </div>
            {result.lastAccessed && result.lastAccessed > 0 && (
              <div className="flex items-center" title="最后访问时间">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatRelativeTime(result.lastAccessed)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
