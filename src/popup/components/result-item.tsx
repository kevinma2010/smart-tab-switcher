import React from 'react';
import { SearchResult } from '../types';

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

  return (
    <div
      className={`p-3 flex items-center cursor-pointer 
        hover:bg-gray-100 dark:hover:bg-gray-700
        ${isSelected ? 'bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600' : ''}
        dark:text-gray-100`}
      onClick={onClick}
    >
      <img
        src={getIcon()}
        className="w-6 h-6 mr-3 flex-shrink-0"
        alt=""
      />
      <div className="flex-grow min-w-0">
        <div className="text-sm font-medium truncate dark:text-gray-100">
          {result.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {result.url}
        </div>
      </div>
      {result.type === 'tab' && (
        <div className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0">
          Switch to Tab
        </div>
      )}
    </div>
  );
};
