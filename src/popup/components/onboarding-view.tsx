import React from 'react';
import browser from 'webextension-polyfill';

interface OnboardingViewProps {
  onFinish: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onFinish }) => {
  const handleFinish = () => {
    // 将引导页完成状态保存到存储中
    browser.storage.local.set({ onboardingCompleted: true })
      .then(() => {
        onFinish();
      })
      .catch(error => {
        console.error('保存引导页状态失败:', error);
        onFinish();
      });
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <img 
          src="../icons/extension/icon-128.png" 
          alt="Smart Tab Switcher Logo" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          欢迎使用 Smart Tab Switcher
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          快速切换和管理您的浏览器标签页
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          主要功能
        </h2>
        
        <div className="mb-6">
          <div className="flex items-start mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">快速切换</h3>
              <p className="text-gray-600 dark:text-gray-300">使用键盘快捷键 <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">{navigator.platform.includes('Mac') ? '⌘+⇧+K' : 'Alt+T'}</span> 快速打开标签切换器</p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">模糊搜索</h3>
              <p className="text-gray-600 dark:text-gray-300">输入关键词即可快速找到您需要的标签页，无需完全匹配</p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">智能排序</h3>
              <p className="text-gray-600 dark:text-gray-300">根据您的使用习惯，自动将最常用的标签页排在前面</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">自定义设置</h3>
              <p className="text-gray-600 dark:text-gray-300">根据您的喜好自定义外观和行为</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          如何使用
        </h2>
        
        <ol className="list-decimal pl-5 space-y-3 text-gray-600 dark:text-gray-300">
          <li>使用键盘快捷键 <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">{navigator.platform.includes('Mac') ? '⌘+⇧+K' : 'Alt+T'}</span> 或点击工具栏上的扩展图标打开标签切换器</li>
          <li>在搜索框中输入关键词以查找标签页</li>
          <li>使用上下箭头键选择标签页，按回车键切换到所选标签页</li>
          <li>点击设置图标自定义扩展的行为和外观</li>
        </ol>
      </div>

      <button 
        onClick={handleFinish}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
      >
        开始使用
      </button>
    </div>
  );
};

export default OnboardingView; 