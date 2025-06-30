# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Smart Tab Switcher is a browser extension built with TypeScript and React that provides fast tab switching and management through fuzzy search. It supports Chrome, Firefox, and Edge browsers.

## Development Commands

### Building and Development
- `pnpm dev:chrome` - Start development mode for Chrome with hot reload
- `pnpm dev:firefox` - Start development mode for Firefox with hot reload
- `pnpm build` - Build production versions for both Chrome and Firefox
- `pnpm build:chrome` - Build production version for Chrome only
- `pnpm build:firefox` - Build production version for Firefox only
- `pnpm build:release` - Create release zip packages in `/release` directory

### Code Quality
- `pnpm type-check` - Run TypeScript type checking (no emit)

### Asset Generation
- `pnpm generate-icons` - Generate icon assets in multiple sizes from source SVGs

### Release Management
- `pnpm release:prepare` - Run pre-release checks to ensure everything is ready
- `pnpm release` - Interactive release process (choose version type)
- `pnpm release:patch` - Quick release for bug fixes (e.g., 1.2.3 → 1.2.4)
- `pnpm release:minor` - Quick release for new features (e.g., 1.2.3 → 1.3.0)
- `pnpm release:major` - Quick release for breaking changes (e.g., 1.2.3 → 2.0.0)

#### Release Workflow
1. Ensure all changes are committed and pushed to main branch
2. Update CHANGELOG.md with all changes under `[Unreleased]` section
3. Run `pnpm release:prepare` to verify release readiness
4. Run appropriate release command (e.g., `pnpm release:minor`)
5. Follow the interactive prompts
6. The script will automatically:
   - Update version numbers
   - Update CHANGELOG with release date
   - Generate store-specific release notes from CHANGELOG
   - Update Chrome Web Store and Firefox Add-ons submission documents
   - Create git commits and tags
   - Build release packages
   - Create GitHub release with zip files
7. Manually upload to Chrome Web Store and Firefox Add-ons using the generated submission notes

See [RELEASE.md](./RELEASE.md) for detailed release process documentation.

## Architecture

### Extension Structure
The extension follows the WebExtension API architecture with:
- **Background Service Worker** (`src/background/`) - Handles extension lifecycle, command registration, and browser events
- **Popup UI** (`src/popup/`) - React-based UI shown when extension is activated
- **Content Scripts** - None currently used

### Key Components
- **SearchModal** (`src/popup/components/SearchModal.tsx`) - Main search interface with fuzzy matching
- **TabItem/BookmarkItem** - Display components for search results
- **Settings** - User preferences management
- **Onboarding** - First-time user experience

### Data Flow
1. User triggers extension via keyboard shortcut or toolbar icon
2. Popup opens with SearchModal
3. User input triggers Fuse.js fuzzy search across tabs and bookmarks
4. Results are sorted by relevance, frequency, and recency
5. Selection navigates to tab or opens bookmark

### Storage
- Uses browser's storage API for:
  - User preferences (theme, shortcuts)
  - Tab usage statistics for smart sorting
  - Onboarding completion status

### Build System
- Webpack 5 with separate configurations for Chrome and Firefox
- TypeScript compilation with ES2020 target
- Tailwind CSS with PostCSS for styling
- Manifest files are browser-specific (v3 for Chrome, v2 for Firefox)

## Key Implementation Details

### Cross-Browser Compatibility
- Uses `webextension-polyfill` for unified API across browsers
- Separate manifest files for Manifest V3 (Chrome) and V2 (Firefox)
- Browser-specific build outputs in `dist/chrome` and `dist/firefox`

### Search Implementation
- Fuse.js provides fuzzy search with configurable threshold
- Searches across tab titles, URLs, and bookmark names
- Smart sorting combines search relevance with usage patterns

### Keyboard Navigation
- Default shortcuts: `Cmd+Shift+K` (Mac) / `Alt+T` (Windows/Linux)
- Custom keyboard shortcuts: Users can modify shortcuts through browser settings (Settings → Keyboard Shortcut)
- Cross-browser support: Chrome, Firefox, and Edge
- Full keyboard navigation within search interface
- Arrow keys for selection, Enter to activate, Escape to close

### Theme Support
- Automatic dark/light mode based on system preferences
- Custom Tailwind configuration with dark mode variants

## Important Notes

- No automated testing framework is currently configured
- No linting tools (ESLint) or code formatters (Prettier) are set up
- Version updates require manual changes to package.json and CHANGELOG.md
- Production builds automatically inject version from package.json into manifests
- The extension requires tabs, bookmarks, and storage permissions


## Git Commit Guidelines

**IMPORTANT**: Do not include any AI tool attribution in git operations:

- No "Generated with [Claude Code]" in commit messages
- No "Co-Authored-By: Claude" in commit messages
- No AI tool references in tags, releases, issues, or pull requests
- Keep all git information clean and focused on the actual changes
## Git Commit Guidelines

**IMPORTANT**: Do not include any AI tool attribution in git operations:

- No "Generated with [Claude Code]" in commit messages
- No "Co-Authored-By: Claude" in commit messages
- No AI tool references in tags, releases, issues, or pull requests
- Keep all git information clean and focused on the actual changes
