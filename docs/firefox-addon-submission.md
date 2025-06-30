# Firefox Add-ons Submission Notes

## Version 1.5.0 Release Notes

### What's New

**Query Modes with Prefix-Based Search**
- Added `b:` prefix for bookmarks-only search filtering
- Added `u:` prefix for URLs mode (tabs/bookmarks + URL suggestions)
- Added `g:` prefix for Google search only
- Maintains default behavior when no prefix is used
- Enhanced search targeting and efficiency

**Enhanced User Experience**
- Query modes help integrated into onboarding guide
- Subtle query modes hint displayed in search placeholder
- More intuitive search workflow for different use cases
- Improved search precision and user control

### Improvements
- More targeted search capabilities for specific content types
- Better user guidance through enhanced onboarding
- Improved search efficiency for power users
- Enhanced discoverability of advanced features

---

## Notes for Reviewer

### Summary
Smart Tab Switcher is a productivity extension that provides fast tab switching and bookmark searching through a fuzzy search interface. This update (v1.5.0) introduces powerful query modes for more targeted and efficient searching.

### Key Changes in This Version

1. **No New Permissions Required**
   - All changes work within existing permissions (tabs, bookmarks, storage)
   - No external API calls or new data collection

2. **Code Changes**
   - Added query mode prefix parsing and filtering logic
   - Implemented bookmarks-only, URLs, and Google search modes
   - Enhanced onboarding with query modes guidance
   - Updated search placeholder with subtle hints
   - No changes to core permissions or data handling

3. **User Data Handling**
   - No changes to existing user data or storage
   - Fully backward compatible with previous versions

### Testing Instructions

1. **Install the extension**
2. **Test query modes functionality:**
   - Open extension with shortcut (default: Alt+T)
   - Try `b:` prefix to search only bookmarks
   - Try `u:` prefix for URLs mode with suggestions
   - Try `g:` prefix for Google search only
   - Test default behavior without prefix
3. **Test user experience:**
   - Verify query modes hints appear in search placeholder
   - Check onboarding guide includes query modes help
   - Test search filtering works correctly for each mode
   - Ensure smooth transition between different search modes
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