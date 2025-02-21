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

  return (
    <div ref={listRef} className="max-h-96 overflow-y-auto">
      {results.map((result, index) => (
        <div key={`${result.type}-${result.id}`} ref={index === selectedIndex ? selectedRef : null}>
          <ResultItem
            result={result}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(result)}
          />
        </div>
      ))}
      
      {results.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No results found. Press Enter to search Google or open URL.
        </div>
      )}
    </div>
  );
};
