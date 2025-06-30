# Release Notes Template

This template is used to auto-generate store-specific release notes during the release process.

## Chrome Web Store Release Notes Template

### Version {{VERSION}} - What's New

{{CHANGELOG_CONTENT}}

### Enhanced User Experience
{{AUTO_GENERATED_SUMMARY}}

---

## Detailed Description for Store Listing (Optional Update)

Smart Tab Switcher - Lightning-fast tab management for power users

**Key Features:**
✓ Instant fuzzy search across all open tabs and bookmarks
✓ Smart sorting by relevance, frequency, and recency
✓ Customizable keyboard shortcuts
✓ Flexible tab opening modes
✓ Direct URL navigation
✓ Google search fallback
✓ Dark/Light theme support
✓ Privacy-focused: No data collection

**New in v{{VERSION}}:**
{{NEW_FEATURES_SUMMARY}}

**How to Use:**
1. Press your shortcut (default: Cmd+Shift+K or Alt+T)
2. Start typing to search tabs or bookmarks
3. Press Enter to switch/open
4. Press Escape to cancel

Perfect for users with many tabs who need quick access to their browsing session.

---

## Testing Notes for Review

This update focuses on user experience improvements:
1. No new permissions required
2. All data stays local (browser.storage.sync)
3. No external connections
4. Backward compatible

The extension remains focused on its core purpose: helping users quickly find and switch between tabs and bookmarks.

## Firefox Add-ons Release Notes Template

### Version {{VERSION}} Release Notes

### What's New

{{CHANGELOG_CONTENT}}

### Improvements
{{IMPROVEMENTS_SUMMARY}}

---

## Notes for Reviewer

### Summary
Smart Tab Switcher is a productivity extension that provides fast tab switching and bookmark searching through a fuzzy search interface. This update (v{{VERSION}}) {{UPDATE_SUMMARY}}.

### Key Changes in This Version

1. **No New Permissions Required**
   - All changes work within existing permissions (tabs, bookmarks, storage)
   - No external API calls or new data collection

2. **Code Changes**
   {{CODE_CHANGES_SUMMARY}}
   - No changes to core search functionality

3. **User Data Handling**
   - No changes to existing user data or storage
   - Fully backward compatible with previous versions

### Testing Instructions

1. **Install the extension**
2. **Test new functionality:**
   {{TESTING_INSTRUCTIONS}}
3. **Test user experience:**
   - Verify all features work properly
   - Ensure search interface remains focused
   - Test with multiple tabs to verify proper functionality
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