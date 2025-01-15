import React from 'react';
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
  return (
    <div className="max-h-96 overflow-y-auto">
      {results.map((result, index) => (
        <ResultItem
          key={`${result.type}-${result.id}`}
          result={result}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(result)}
        />
      ))}
      
      {results.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No results found. Press Enter to search Google or open URL.
        </div>
      )}
    </div>
  );
};
