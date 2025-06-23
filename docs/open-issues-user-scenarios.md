# Open Issues: User Scenarios Analysis

This document analyzes user scenarios related to open issues in Smart Tab Switcher for product planning and prioritization.

## Issue #11: Change Enter Key Behavior - Open in Current Tab

### Current Behavior
- **Open tabs**: Enter switches to that tab
- **Bookmarks/Search/URLs**: Enter opens in new tab (foreground)

### User Expected Behavior
- **Enter**: Open in current tab (replace current content)
- **Ctrl+Enter**: Open in new tab (preserve current page)

### Scenario 1: Obsidian + Firefox Workflow
- **User**: Anarchtism (Issue reporter)
- **Environment**: Switching between Obsidian and Firefox
- **Need**: After switching from Obsidian to browser, wants to browse content in current tab
- **Current pain point**: Opening bookmarks always creates new tabs, leading to tab clutter
- **Expected behavior**:
  - `Enter`: Open in current tab, keeping a clean tab bar
  - `Ctrl+Enter`: Open in new tab when current page needs to be preserved

### Scenario 2: Single-Tab Browsing Mode
- **User**: Minimalist users
- **Environment**: Prefer browsing in one tab, navigating with forward/back
- **Need**: When searching and accessing bookmarks, prefer opening in current tab
- **Value**: Reduces tab management burden, keeps browser clean

### Scenario 3: Quick Information Lookup
- **User**: Information workers
- **Environment**: Need to quickly check multiple bookmark contents
- **Workflow**:
  1. Open a blank tab
  2. Use Smart Tab Switcher to search bookmarks
  3. Enter to view in current tab
  4. Continue searching next bookmark, reusing the same tab
- **Benefit**: Avoid opening too many tabs

### Scenario 4: Referencing Obsidian Quick Switcher Behavior
- **Background**: Users are familiar with Obsidian's quick switcher behavior
- **Obsidian behavior**:
  - Enter opens file in current panel
  - Ctrl/Cmd+Enter opens file in new panel
- **Expectation**: Browser extension maintains consistent interaction patterns

## Issue #10: Symbol Prefix for Query Mode Switching

### Scenario 1: Focus on Bookmark Search
- **User**: Knowledge workers
- **Environment**: 200+ technical documentation bookmarks, 50+ open tabs
- **Pain point**: Tab results interfere with bookmark finding during search
- **Expectation**: Type `@react` to search only React resources in bookmarks

### Scenario 2: Search Current Tabs Only
- **User**: Full-stack developers
- **Environment**: Multiple localhost ports open
- **Need**: Type `:3000` to search only among open tabs
- **Value**: Avoid triggering search engines or showing irrelevant bookmarks

### Scenario 3: Direct Web Search
- **User**: General users
- **Environment**: Want to search new content rather than switch tabs
- **Expectation**: Type `!machine learning` to directly use search engine
- **Benefit**: Unified entry point, fewer operation steps

### Symbol Prefix Examples
```
@documentation  → Show only bookmarks containing documentation
:localhost      → Search only among open tabs
!new tech       → Direct Google search
#work           → Show only bookmarks tagged "work" (if tag feature supported)
```

## Issue #9: Improved Keyboard Navigation (Tab/Ctrl+J/K)

### Scenario 1: One-Handed Operation
- **User**: Multitaskers
- **Environment**: Left hand holding coffee/phone, right hand on keyboard
- **Pain point**: Moving right hand from main keyboard area to arrow keys is too far
- **Expectation**: Use Tab key to navigate up/down through results

### Scenario 2: Vim User Habits
- **User**: Programmers (Vim users)
- **Environment**: Familiar with Vim keybindings (J down, K up)
- **Expectation**: `Ctrl+J/K` navigation, keeping hands in main keyboard area
- **Efficiency boost**: Search and selection in one fluid motion

### Scenario 3: Rapid Sequential Operations
- **User**: Sales personnel
- **Environment**: Quickly switching between multiple customer pages
- **Workflow**:
  1. Type first few letters of customer name
  2. Tab to quickly select (without moving hands)
  3. Enter to confirm
- **Value**: Entire process without leaving main keyboard area

### Scenario 4: Laptop Users
- **User**: Mobile office workers
- **Environment**: Using laptop trackpad, arrow key positions awkward
- **Need**: More ergonomic navigation methods

## Comprehensive Usage Scenarios

### Knowledge Worker's Day
1. **Morning email check**: `!gmail` prefix to quickly search and open email
2. **Task processing**: `@jira` to see only favorited project boards
3. **Research**: Find resources, use `Ctrl+Enter` to open in new tab for comparison
4. **Documentation writing**: Use `Tab` key to quickly switch between reference materials
5. **Team communication**: `:slack` to quickly find team communication pages

### Developer Workflow
1. **Local development**: `:3000` to quickly locate development server
2. **Documentation lookup**: `@mdn` to find MDN docs in bookmarks
3. **Problem solving**: After finding bug, `!error message` to search directly
4. **Code review**: `Ctrl+J/K` to quickly browse multiple PR pages

## Feature Priority Recommendations

Based on user scenario analysis, suggested priority order:

1. **High Priority**: Issue #11 (New tab opening)
   - Basic need affecting all users
   - Relatively simple implementation
   - Immediate user experience improvement

2. **Medium Priority**: Issue #10 (Query mode switching)
   - Advanced user feature
   - Significantly improves search efficiency
   - Requires good UI/UX design

3. **Low Priority**: Issue #9 (Alternative navigation keys)
   - Nice-to-have feature
   - Serves specific user groups
   - Can be provided as settings option

## Implementation Suggestions

1. **Issue #11**:
   - Add keyboard event listening
   - Allow behavior customization in settings
   - Maintain consistency with native browser behavior

2. **Issue #10**:
   - Design clear symbol system
   - Provide symbol hints/help
   - Consider configurability

3. **Issue #9**:
   - Provide as optional setting
   - Support multiple navigation modes
   - Don't affect existing user habits

---

*Last updated: 2025-01-23*