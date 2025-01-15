import React, { useRef, useEffect } from 'react';
import { useKeyboard } from '../hooks/use-keyboard';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onEscape: () => void;
  onEnter: () => void;
  onArrowUp: () => void;
  onArrowDown: () => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onEscape();
        break;
      case 'Enter':
        onEnter();
        break;
      case 'ArrowUp':
        e.preventDefault();
        onArrowUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onArrowDown();
        break;
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <input
        ref={inputRef}
        type="text"
        className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 
          dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:placeholder-gray-400"
        placeholder="Search tabs, bookmarks, or enter URL..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
};
