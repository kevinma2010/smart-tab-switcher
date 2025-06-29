import React from 'react';
import { SearchResult } from '../types';
import { formatRelativeTime } from '../utils/time';

interface ResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  onClose?: () => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({
  result,
  isSelected,
  onClick,
  onClose,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
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

  // Display usage data (only for tabs and bookmarks)
  const showUsageData = result.type === 'tab' || result.type === 'bookmark';

  // Generate frequency stars (0-5 stars)
  const getFrequencyStars = () => {
    if (!result.accessCount || result.accessCount <= 0) return 0;
    if (result.accessCount >= 10) return 5;  // Frequently used (10+ times)
    if (result.accessCount >= 5) return 4;   // Multiple uses (5-9 times)
    if (result.accessCount >= 3) return 3;   // Occasional use (3-4 times)
    if (result.accessCount >= 2) return 2;   // Used a few times (2 times)
    return 1;                                // Used once
  };

  const frequencyStars = getFrequencyStars();

  // Get type label
  const getTypeLabel = () => {
    switch (result.type) {
      case 'tab':
        return { text: 'Tab', bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 'bookmark':
        return { text: 'Bookmark', bgColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
      case 'google':
        return { text: 'Search', bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      case 'url':
        return { text: 'URL', bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      default:
        return { text: '', bgColor: '' };
    }
  };

  const typeLabel = getTypeLabel();

  return (
    <div
      className={`relative p-3 flex items-center cursor-pointer border-b border-gray-100 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700
        ${isSelected ? 'bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600' : ''}
        dark:text-gray-100 transition-colors`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isHovered || isSelected) && result.type === 'tab' && onClose && (
        <button
          className="absolute top-0.5 left-0.5 w-5 h-5 flex items-center justify-center
            bg-gray-200/80 dark:bg-gray-600/80 hover:bg-gray-300 dark:hover:bg-gray-500
            rounded-full transition-colors shadow-sm z-10"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
          onMouseDown={(e) => {
            // Prevent focus loss
            e.preventDefault();
          }}
          title="Close tab"
        >
          <svg
            className="w-3 h-3 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
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
              <div className="flex items-center" title="Last accessed">
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
