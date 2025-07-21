# Smart Tab Switcher - Technical Documentation

## Overview

Browser extension for fast tab switching through real-time search and keyboard navigation.

**Core Features**: Keyboard shortcuts (`Cmd+Shift+K` / `Alt+T`), fuzzy search, tab/bookmark search, URL recognition, Google search fallback.

## 3. Technology Stack

- Framework: React 18
- Language: TypeScript
- Build Tool: Webpack
- Styling: Tailwind CSS
- Search Library: Fuse.js
- Extension Framework: Firefox WebExtensions API (MV3)

## 4. Architecture Design

### 4.1 Directory Structure
```
quick-tab-switcher/
├── src/
│   ├── background/
│   │   └── background.ts      # Background script
│   ├── popup/
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Utility functions
│   │   ├── popup.tsx         # Entry file
│   │   └── popup.html        # HTML template
│   ├── icons/                # Icon resources
│   ├── manifest.chrome.json  # Chrome manifest
│   └── manifest.firefox.json # Firefox manifest
```

### 4.2 Core Modules

#### 4.2.1 Background Script (background.ts)
- Handle keyboard shortcut events
- Maintain tab cache
- Manage extension lifecycle

#### 4.2.2 Search Logic (hooks/useSearch.ts)
- Real-time search functionality
- Result scoring and sorting
- Cache management

#### 4.2.3 Keyboard Navigation (hooks/useKeyboard.ts)
- Handle arrow key navigation
- Enter key selection
- Escape key dismissal

#### 4.2.4 Tab Management (hooks/useTabs.ts)
- Tab list maintenance
- Tab switching
- New tab creation

## 5. Data Structures

```typescript
interface SearchResult {
  id: string;
  type: 'tab' | 'bookmark' | 'google' | 'url';
  title: string;
  url: string;
  favicon?: string;
  score?: number;
}

interface TabInfo {
  id: number;
  title: string;
  url: string;
  favicon?: string;
}

interface BookmarkInfo {
  id: string;
  title: string;
  url: string;
  dateAdded: number;
}
```

## 6. Key Workflows

**Search**: Input → Debounce (300ms) → Parallel search → Score/sort → Display

**Tab Switch**: Selection → Type check → Action (switch tab, open bookmark/URL, or Google search)

## 7. Performance Optimizations

**Search**: Fuse.js fuzzy search, result caching, input debouncing
**Rendering**: React.memo, virtual lists, lazy loading
**Caching**: Tab/bookmark data, search results
**Theme**: Auto dark/light mode with persistence

## 8. Configuration

**Firefox**: Requires `browser_specific_settings` with min version 109.0
**Permissions**: `tabs`, `bookmarks`, `scripting`

## 9. Development Guidelines

### 9.1 Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- Browser (Chrome v88+ / Firefox v109.0+ / Edge v88+)

### 9.2 Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/kevinma2010/smart-tab-switcher.git
   cd smart-tab-switcher
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Development Mode**
   ```bash
   # For Chrome development
   pnpm dev:chrome
   
   # For Firefox development  
   pnpm dev:firefox
   ```

4. **Load in Browser**
   - For Chrome/Edge:
     * Go to `chrome://extensions` or `edge://extensions`
     * Enable "Developer mode"
     * Click "Load unpacked"
     * Select the `dist/chrome` directory
   - For Firefox:
     * Navigate to `about:debugging`
     * Click "This Firefox"
     * Click "Load Temporary Add-on"
     * Select `manifest.json` from the `dist/firefox` directory

### 9.3 Build Commands

```bash
# Build for both browsers
pnpm build

# Build for specific browser
pnpm build:chrome
pnpm build:firefox

# Build release packages
pnpm build:release
```

Built files will be located in:
- `dist/chrome` - Chrome/Edge extension
- `dist/firefox` - Firefox extension  
- `release/` - Release packages (after running `build:release`)

### 9.4 Type Checking

```bash
# Run TypeScript type checking
pnpm type-check
```

### 9.5 Debugging
- Load via `about:debugging` (Firefox) or developer mode (Chrome)
- Check background console and popup inspector

### 9.6 Release Build

```bash
pnpm build:release
```

Generates release packages in `release/` directory for both browsers.

## 10. Future Improvements

- **Search**: Historical usage weighting, improved matching
- **UI/UX**: Animations, better keyboard navigation
- **Performance**: Enhanced caching, reduced re-renders
- **Features**: Tab grouping, command palette
- **Themes**: Custom themes, more color schemes

## 11. Important Considerations

- **Permissions**: Follow minimum permission principle
- **Performance**: Minimize DOM operations, use appropriate caching
- **Compatibility**: Firefox 109.0+, MV3 compliant

## 12. Testing Strategy

- **Unit**: Component, hook, and utility testing with Jest
- **Integration**: Extension workflows, browser APIs, search functionality
- **E2E**: Full workflows, cross-platform, performance

## 13. Deployment

1. Update version and changelog
2. Build with `pnpm build`
3. Submit for review and update docs

## 14. Maintenance

- **Code**: TypeScript best practices, consistent style, API documentation
- **Monitoring**: Performance audits, user feedback, error tracking
- **Security**: Regular reviews, dependency updates, code scanning

## 15. Version Management

**Branches**: `main` (stable), `develop`, `feature/*`, `hotfix/*`

**Versioning**: Semantic (major.minor.patch)

**Commits**: `feat:`, `fix:`, `docs:`, `chore:`, etc.