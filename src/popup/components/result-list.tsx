import React, { useRef, useEffect } from 'react';
import { SearchResult } from '../types';
import { ResultItem } from './result-item';

interface ResultListProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
}

export const ResultList: React.FC<ResultListProps> = ({
  results,
  selectedIndex,
  onSelect,
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

  // 对结果进行分组
  const groupedResults = results.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  // 定义分组顺序和标题
  const groupOrder = ['tab', 'bookmark', 'url', 'google'];
  const groupTitles = {
    tab: '标签页',
    bookmark: '书签',
    url: '网址',
    google: '搜索'
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
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      ) : (
        <div className="p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            未找到匹配结果
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            按回车键搜索 Google 或打开网址
          </div>
        </div>
      )}
    </div>
  );
};
