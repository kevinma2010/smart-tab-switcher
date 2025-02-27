import { useCallback } from 'react';
import { SearchResult } from '../types';

export const useKeyboard = (
  results: SearchResult[],
  selectedIndex: number,
  setSelectedIndex: (value: number | ((prev: number) => number)) => void,
  onClose: () => void,
  onSelect?: (result: SearchResult) => Promise<void>
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
    
    try {
      const selected = results[selectedIndex];
      
      if (onSelect) {
        // 使用传入的选择处理函数
        await onSelect(selected);
      } else {
        // 默认行为保持不变
        onClose();
      }
    } catch (error) {
      console.error('Error handling enter key:', error);
      // 如果出错，尝试关闭窗口
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
