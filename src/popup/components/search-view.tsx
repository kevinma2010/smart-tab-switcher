import React from 'react';
import { SearchBox } from './search-box';
import { ResultList } from './result-list';
import { useSearch } from '../hooks/use-search-complete';
import { useKeyboard } from '../hooks/use-keyboard';
import { SearchResult } from '../types';

interface SearchViewProps {
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onOpenSettings, onOpenAbout }) => {
  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    handleSelect
  } = useSearch();

  const handleClose = () => {
    window.close();
  };

  const {
    handleArrowUp,
    handleArrowDown,
    handleEnter,
    handleEscape
  } = useKeyboard(results, selectedIndex, setSelectedIndex, handleClose, handleSelect);

  return (
    <div>
      <div className="flex items-center p-2">
        <div className="flex-grow">
          <SearchBox
            value={query}
            onChange={setQuery}
            onEscape={handleEscape}
            onEnter={(withModifier) => handleEnter(withModifier)}
            onArrowUp={handleArrowUp}
            onArrowDown={handleArrowDown}
          />
        </div>
        <button 
          onClick={onOpenAbout}
          className="self-start mt-5 mr-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="About"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button 
          onClick={onOpenSettings}
          className="self-start mt-5 mr-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Settings"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <ResultList
        results={results}
        selectedIndex={selectedIndex}
        onSelect={(result) => handleSelect(result, 'current')}
      />
    </div>
  );
};
