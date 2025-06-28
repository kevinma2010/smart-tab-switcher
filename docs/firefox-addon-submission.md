# Firefox Add-ons Submission Notes

## Version 1.3.0 Release Notes

### What's New

**Custom Keyboard Shortcuts**
- Users can now customize keyboard shortcuts through Firefox's Add-ons Manager
- Navigate to: Add-ons Manager → Smart Tab Switcher → Manage → Settings → Manage Extension Shortcuts
- Default shortcut remains Alt+T (Windows/Linux) or Cmd+Shift+K (Mac)

**Enhanced Tab Navigation**
- New tab opening modes for better user control:
  - Standard Mode (NEW DEFAULT): Press Enter to open in current tab, Ctrl/Cmd+Enter for new tab
  - Classic Mode: Press Enter to always open in new tab (previous behavior)
- Mode can be changed in the extension's Settings page
- Provides more intuitive navigation that matches browser conventions

**Security Update**
- Updated dependencies to resolve security vulnerability CVE-2025-5889

### Improvements
- Better keyboard navigation hints in the UI
- Updated onboarding experience with new keyboard shortcuts
- Enhanced settings interface with clear mode descriptions

---

## Notes for Reviewer

### Summary
Smart Tab Switcher is a productivity extension that provides fast tab switching and bookmark searching through a fuzzy search interface. This update (v1.3.0) adds user-requested features for keyboard shortcut customization and flexible tab opening behavior.

### Key Changes in This Version

1. **No New Permissions Required**
   - All changes work within existing permissions (tabs, bookmarks, storage)
   - No external API calls or new data collection

2. **Code Changes**
   - Added settings for tab opening behavior (stored in browser.storage.sync)
   - Implemented keyboard modifier detection (Ctrl/Cmd key)
   - Added UI for displaying keyboard shortcut instructions
   - No changes to core search functionality

3. **User Data Handling**
   - New settings are stored in browser.storage.sync
   - No changes to existing user data
   - Backward compatible with previous versions

### Testing Instructions

1. **Install the extension**
2. **Test keyboard shortcut customization:**
   - Open Add-ons Manager (Ctrl+Shift+A)
   - Find Smart Tab Switcher → Manage → Settings → Manage Extension Shortcuts
   - Try changing the shortcut
3. **Test tab opening modes:**
   - Open extension with shortcut (default: Alt+T)
   - Search for any tab or bookmark
   - Test Enter key (should open in current tab by default)
   - Test Ctrl+Enter (should open in new tab)
   - Go to Settings and switch to Classic Mode
   - Verify Enter now always opens in new tab
4. **Verify no console errors or warnings**

### Build Information
- Built with Webpack 5
- TypeScript with strict mode
- Uses webextension-polyfill for cross-browser compatibility
- Manifest V2 for Firefox compatibility

### Source Code
The extension is open source: https://github.com/kevinma2010/smart-tab-switcher

### Previous Review History
This extension has been successfully reviewed and published in previous versions without issues.

### Contact
If you need any clarification or have questions, please feel free to reach out through the reviewer notes.