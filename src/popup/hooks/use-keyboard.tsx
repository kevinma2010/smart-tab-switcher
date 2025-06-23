import { useCallback } from 'react';
import { SearchResult, OpeningMode } from '../types';

export const useKeyboard = (
  results: SearchResult[],
  selectedIndex: number,
  setSelectedIndex: (value: number | ((prev: number) => number)) => void,
  onClose: () => void,
  onSelect?: (result: SearchResult, mode: OpeningMode) => Promise<void>
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

  const handleEnter = useCallback(async (withModifier: boolean = false) => {
    if (!results.length) return;
    
    try {
      const selected = results[selectedIndex];
      
      if (onSelect) {
        // Determine opening mode based on modifier key
        const mode: OpeningMode = withModifier ? 'new' : 'current';
        await onSelect(selected, mode);
      } else {
        // Default behavior remains unchanged
        onClose();
      }
    } catch (error) {
      console.error('Error handling enter key:', error);
      // If an error occurs, try to close the window
      onClose();
    }
  }, [results, selectedIndex, onClose, onSelect]);

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
