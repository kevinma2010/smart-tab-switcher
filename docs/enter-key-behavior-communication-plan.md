# Enter Key Behavior Design - User Communication Plan

## Background
Based on Issue #11, we're planning to change the default Enter key behavior:
- **Current behavior**: Enter opens bookmarks/search results in new tab
- **New behavior**: Enter opens in current tab, Ctrl+Enter (Cmd+Enter on Mac) opens in new tab

## User Communication Locations and Implementation Plan

### 1. Search Box Bottom Hints (Highest Priority)
**Location**: `src/popup/components/search-box.tsx:90-100`

**Current display**:
```
↑↓ Navigate    Enter Select    Esc Close
```

**Updated to**:
```
↑↓ Navigate    Enter Open    Ctrl+Enter New Tab    Esc Close
```

**Implementation details**:
- In narrower windows, can be simplified to: `Enter Open · Ctrl+Enter New`
- Use icons for assistance: `⏎ Open · ⌘⏎ New Tab` (Mac) or `⏎ Open · Ctrl+⏎ New Tab` (Windows/Linux)

### 2. Settings Page Option
**Location**: `src/popup/components/settings-view.tsx`

**New setting item**:
```typescript
// Default opening method
□ Classic mode: Enter key always opens in new tab
■ Standard mode: Enter opens in current tab, Ctrl+Enter opens in new tab (recommended)
```

**Implementation details**:
- Default to "Standard mode"
- Add explanatory text describing the differences between modes
- Settings take effect immediately, no restart required

### 3. New User Onboarding Update
**Location**: `src/popup/components/onboarding-view.tsx:115`

**Current text**:
```
Use up and down arrow keys to select a tab, press Enter to switch to the selected tab
```

**Updated to**:
```
Keyboard shortcuts:
• ↑↓ - Navigate between results
• Enter - Open in current tab
• Ctrl+Enter (Cmd+Enter on Mac) - Open in new tab
• Esc - Close search
```

### 4. No Search Results Hint
**Location**: `src/popup/components/result-list.tsx:106`

**Current hint**:
```
Press Enter to search Google or open URL
```

**Updated to**:
```
Press Enter to search in current tab
Press Ctrl+Enter to search in new tab
```

### 5. Version Update Notification
**Implementation approach**:
- Show one-time notification when extension updates to version containing this feature
- Use `browser.storage.local` to record whether notification has been shown

**Notification content**:
```
🎉 New Feature: More Flexible Tab Control!

Now you can choose how to open links:
• Enter - Open in current tab
• Ctrl+Enter - Open in new tab

You can switch back to classic mode in settings.
```

### 6. Visual Hint Enhancement
**Search result item optimization**:
- On mouse hover, show keyboard shortcut hints on the right side of result items
- Use tooltip to display: "Enter: current tab | Ctrl+Enter: new tab"

### 7. Documentation Update Checklist
Documents that need updating:
- [ ] README.md - Update keyboard shortcuts section
- [ ] Chrome Web Store description - Explain in feature list
- [ ] Firefox Add-ons description - Sync updates
- [ ] GitHub Release Notes - Detail behavior changes

### 8. Migration Strategy
For smooth transition:
1. **Phase 1**: Add Ctrl+Enter support, maintain Enter's original behavior
2. **Phase 2**: Provide toggle option in settings, default still to old behavior
3. **Phase 3**: New installations default to new behavior, existing users keep original settings
4. **Phase 4**: Prompt existing users to try new behavior (optional)

## Implementation Priority

1. **Immediate implementation**:
   - Search box bottom hint updates
   - Add Ctrl+Enter functionality support

2. **Next version**:
   - Settings page option
   - Update notification
   - Documentation updates

3. **Future optimization**:
   - Visual hint enhancement
   - Onboarding optimization

## Success Metrics

- Reduced user feedback about "don't know how to open in new tab"
- Issue #11 resolved
- No significant user complaints about behavior changes

## Risk Management

- **Risk**: Existing users uncomfortable with new behavior
- **Mitigation**: Provide settings option to switch back to classic mode

- **Risk**: Keyboard shortcut hints take up too much space
- **Mitigation**: Responsive design, simplify hints in small windows

---

*Created: 2025-01-23*
*Related Issue: #11*