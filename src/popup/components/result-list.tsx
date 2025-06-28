import React, { useRef, useEffect } from 'react';
import { SearchResult } from '../types';
import { ResultItem } from './result-item';

interface ResultListProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
  onCloseTab?: (tabId: string) => void;
}

export const ResultList: React.FC<ResultListProps> = ({
  results,
  selectedIndex,
  onSelect,
  onCloseTab,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current && listRef.current) {
      const list = listRef.current;
      const selected = selectedRef.current;
      
      const listRect = list.getBoundingClientRect();
      const selectedRect = selected.getBoundingClientRect();
      
      // Check if the selected item is not fully visible
      if (selectedRect.bottom > listRect.bottom) {
        // If below visible area, scroll down
        selected.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else if (selectedRect.top < listRect.top) {
        // If above visible area, scroll up
        selected.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedIndex]);

  // Group results
  const groupedResults = results.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  // Define group order and titles
  const groupOrder = ['tab', 'bookmark', 'url', 'google'];
  const groupTitles = {
    tab: 'Tabs',
    bookmark: 'Bookmarks',
    url: 'URLs',
    google: 'Search'
  };

  return (
    <div ref={listRef} className="max-h-96 overflow-y-auto">
      {results.length > 0 ? (
        <>
          {groupOrder.map(group => {
            const groupResults = groupedResults[group];
            if (!groupResults || groupResults.length === 0) return null;
            
            return (
              <div key={group} className="mb-2">
                <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                  {groupTitles[group as keyof typeof groupTitles]} ({groupResults.length})
                </div>
                {groupResults.map((result, groupIndex) => {
                  const index = results.findIndex(r => r.id === result.id);
                  return (
                    <div 
                      key={`${result.type}-${result.id}`} 
                      ref={index === selectedIndex ? selectedRef : null}
                    >
                      <ResultItem
                        result={result}
                        isSelected={index === selectedIndex}
                        onClick={() => {
                          try {
                            onSelect(result);
                          } catch (error) {
                            console.error('Error selecting result:', error);
                          }
                        }}
                        onClose={
                          result.type === 'tab' && onCloseTab
                            ? () => onCloseTab(result.id)
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-base mb-2">
            No matching results found
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Press Enter to search in current tab<br/>
            Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to search in new tab
          </div>
        </div>
      )}
    </div>
  );
};