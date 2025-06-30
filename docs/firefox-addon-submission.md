# Firefox Add-ons Submission Notes

### Version 1.6.0 Release Notes

### What's New



### Improvements
Performance and stability improvements

---

## Notes for Reviewer

### Summary
Smart Tab Switcher is a productivity extension that provides fast tab switching and bookmark searching through a fuzzy search interface. This update (v1.6.0) includes bug fixes and improvements.

### Key Changes in This Version

1. **No New Permissions Required**
   - All changes work within existing permissions (tabs, bookmarks, storage)
   - No external API calls or new data collection

2. **Code Changes**
      - General improvements and bug fixes
   - No changes to core search functionality

3. **User Data Handling**
   - No changes to existing user data or storage
   - Fully backward compatible with previous versions

### Testing Instructions

1. **Install the extension**
2. **Test new functionality:**
      - Verify all existing functionality works correctly
   - Test performance improvements
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
