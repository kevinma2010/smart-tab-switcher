import React from 'react';
import { SearchBox } from './search-box';
import { ResultList } from './result-list';
import { useSearch } from '../hooks/use-search-complete';
import { useKeyboard } from '../hooks/use-keyboard';
import { useTabs } from '../hooks/use-tabs';
import { SearchResult } from '../types';

export const SearchView: React.FC = () => {
  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex
  } = useSearch();

  const { switchToTab, createTab } = useTabs();

  const handleClose = () => {
    window.close();
  };

  const handleSelect = async (result: SearchResult) => {
    switch (result.type) {
      case 'tab':
        await switchToTab(Number(result.id));
        break;
      case 'bookmark':
      case 'url':
      case 'google':
        await createTab(result.url);
        break;
    }
    handleClose();
  };

  const {
    handleArrowUp,
    handleArrowDown,
    handleEnter,
    handleEscape
  } = useKeyboard(results, selectedIndex, setSelectedIndex, handleClose);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <SearchBox
        value={query}
        onChange={setQuery}
        onEscape={handleEscape}
        onEnter={handleEnter}
        onArrowUp={handleArrowUp}
        onArrowDown={handleArrowDown}
      />
      <ResultList
        results={results}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      />
    </div>
  );
};
