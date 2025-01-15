import { useCallback } from 'react';
import { SearchResult } from '../types';
import browser from 'webextension-polyfill';

export const useKeyboard = (
  results: SearchResult[],
  selectedIndex: number,
  setSelectedIndex: (value: number | ((prev: number) => number)) => void,
  onClose: () => void
) => {
  const handleArrowUp = useCallback(() => {
    setSelectedIndex((prev: number) => 
      prev <= 0 ? results.length - 1 : prev - 1
    );
  }, [results.length, setSelectedIndex]);

  const handleArrowDown = useCallback(() => {
    setSelectedIndex(prev => 
      prev >= results.length - 1 ? 0 : prev + 1
    );
  }, [results.length, setSelectedIndex]);

  const handleEnter = useCallback(async () => {
    if (!results.length) return;
    
    const selected = results[selectedIndex];
    
    switch (selected.type) {
      case 'tab':
        // Switch to existing tab
        await browser.tabs.update(Number(selected.id), { active: true });
        break;
      
      case 'bookmark':
      case 'url':
      case 'google':
        // Open new tab
        await browser.tabs.create({ url: selected.url });
        break;
    }
    
    onClose();
  }, [results, selectedIndex, onClose]);

  const handleEscape = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    handleArrowUp,
    handleArrowDown,
    handleEnter,
    handleEscape
  };
};
