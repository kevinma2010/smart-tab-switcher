import { useState, useEffect } from 'react';
import type { Theme, ThemeConfig } from '../types';
import browser from 'webextension-polyfill';

export function useTheme(): ThemeConfig {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  // 加载保存的主题设置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const result = await browser.storage.local.get('theme');
        if (result.theme) {
          setTheme(result.theme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);

  useEffect(() => {
    // 检测是否为 Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                    (navigator.vendor && navigator.vendor.indexOf('Apple') > -1);
    
    // 尝试使用标准方法检测系统主题
    let systemDark = false;
    try {
      systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.warn('Error detecting system theme:', error);
      // 在 Safari 中，如果标准方法失败，使用备用方法
      if (isSafari) {
        // Safari 扩展中可能需要使用其他方法检测主题
        // 这里我们使用一个启发式方法：检查页面背景颜色
        const computedStyle = window.getComputedStyle(document.body);
        const backgroundColor = computedStyle.backgroundColor;
        // 如果背景颜色是深色，则认为是暗色主题
        const rgb = backgroundColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const [r, g, b] = rgb.map(Number);
          // 使用亮度公式判断是否为暗色
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          systemDark = brightness < 128;
        }
      }
    }
    
    // 根据主题设置和系统主题确定是否使用暗色模式
    const newIsDark = theme === 'system' ? systemDark : theme === 'dark';
    setIsDark(newIsDark);
    
    // 保存主题设置
    const saveTheme = async () => {
      try {
        await browser.storage.local.set({ theme });
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };
    saveTheme();

    // 监听系统主题变化
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          setIsDark(e.matches);
        }
      };

      // 使用正确的事件监听方法（兼容不同浏览器）
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // 旧版 Safari 可能使用 addListener
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.warn('Error setting up theme listener:', error);
      // 如果监听失败，不返回清理函数
      return undefined;
    }
  }, [theme]);

  // 提供更新主题的方法
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, isDark, updateTheme };
} 