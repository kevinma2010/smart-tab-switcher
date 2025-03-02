import React from 'react';
import browser from 'webextension-polyfill';
import { VERSION } from '../utils/version';

interface AboutViewProps {
  onBack: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  // Open onboarding page
  const openOnboardingPage = async () => {
    try {
      const onboardingUrl = browser.runtime.getURL('onboarding.html');
      await browser.tabs.create({ url: onboardingUrl });
      window.close(); // Close popup window
    } catch (error) {
      console.error('Error opening onboarding page:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Back"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">About</h2>
      </div>
      
      <div className="space-y-6">
        {/* Version Information */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Smart Tab Switcher</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Version {VERSION}
          </p>
        </div>
        
        {/* Project Description */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">About This Project</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Smart Tab Switcher is a powerful browser extension that helps you efficiently manage and switch browser tabs through an intuitive interface and quick search functionality.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This extension is open source and licensed under the GNU General Public License v3.0.
          </p>
        </div>
        
        {/* User Guide */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">User Guide</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Need help getting started? View our user guide to learn about all the features.
          </p>
          <button 
            onClick={openOnboardingPage}
            className="w-full flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium">View User Guide</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Open the onboarding page to learn about the extension's features and usage
              </p>
            </div>
          </button>
        </div>
        
        {/* Author Information */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Author</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Kevin Ma
          </p>
          <div>
            <a 
              href="https://github.com/kevinma2010/smart-tab-switcher" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Project Repository
            </a>
          </div>
        </div>
        
        {/* Latest Changes */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Latest Changes</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            View the complete changelog to see all updates and improvements to Smart Tab Switcher.
          </p>
          <a 
            href="https://github.com/kevinma2010/smart-tab-switcher/blob/main/CHANGELOG.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View changelog on GitHub
          </a>
        </div>
        
        {/* Feedback & Support */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Feedback & Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Found a bug or have a feature request? I'd love to hear from you!
          </p>
          <div>
            <a 
              href="https://github.com/kevinma2010/smart-tab-switcher/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Report an issue on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 