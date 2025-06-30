# Chrome Web Store Submission Notes

## Version 1.5.0 - What's New

### Query Modes with Prefix-Based Search
Powerful new search filtering system:
- `b:` prefix for bookmarks-only search
- `u:` prefix for URLs mode (tabs/bookmarks + URL suggestions)
- `g:` prefix for Google search only
- No prefix maintains default behavior (search all)

### Enhanced User Experience
- Query modes help integrated into onboarding guide
- Subtle query modes hint in search placeholder
- More targeted and efficient search capabilities
- Improved search workflow for different use cases

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

**New in v1.5.0:**
- Query modes with prefix-based search filtering (b:, u:, g:)
- Enhanced search targeting for bookmarks, URLs, and Google search
- Improved onboarding with query modes guidance
- More efficient search workflow for different use cases

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