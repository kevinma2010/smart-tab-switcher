import React, { useRef, useEffect, useState } from 'react';
import { useKeyboard } from '../hooks/use-keyboard';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onEscape: () => void;
  onEnter: (withModifier?: boolean) => void;
  onArrowUp: () => void;
  onArrowDown: () => void;
  onDelete?: () => void;
  onTab?: (shiftKey: boolean) => void;
  onFocus?: () => void;
  className?: string;
}

export const SearchBox = React.forwardRef<HTMLInputElement, SearchBoxProps>(({
  value,
  onChange,
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onDelete,
  onTab,
  onFocus,
  className = '',
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Combine refs
  React.useImperativeHandle(ref, () => inputRef.current!);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onEscape();
        break;
      case 'Enter':
        // Check for Ctrl (Windows/Linux) or Cmd (Mac) modifier key
        const withModifier = e.ctrlKey || e.metaKey;
        onEnter(withModifier);
        break;
      case 'ArrowUp':
        e.preventDefault();
        onArrowUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onArrowDown();
        break;
      case 'Delete':
        if (onDelete) {
          e.preventDefault();
          onDelete();
        }
        break;
      case 'Tab':
        if (onTab) {
          e.preventDefault();
          onTab(e.shiftKey);
        }
        break;
    }
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`px-2 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-10 pr-10 py-2 text-lg rounded-lg border border-gray-300 
            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:placeholder-gray-400"
          placeholder="Search tabs, bookmarks or enter URL... (try b:, u:, g: prefixes)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => setIsFocused(false)}
          autoFocus
        />
        {value && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">↑↓</kbd>
          <span>Select</span>
        </div>
        
        <div className="flex items-center">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">Tab</kbd>
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">⇧Tab</kbd>
          <span>Move</span>
        </div>
        
        <div className="flex items-center">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">Enter</kbd>
          <span>Open</span>
        </div>
        
        <div className="flex items-center">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
          </kbd>
          <span>New Tab</span>
        </div>
        
        <div className="flex items-center">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">Del</kbd>
          <span>Close</span>
        </div>
        
        <div className="flex items-center">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">Esc</kbd>
          <span>Exit</span>
        </div>
      </div>
    </div>
  );
});

SearchBox.displayName = 'SearchBox';
