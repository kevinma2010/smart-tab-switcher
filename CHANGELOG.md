# Changelog
All notable changes to Quick Tab Switcher will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Auto-scroll functionality for keyboard navigation in search results

### Changed
- Improved browser compatibility:
  - Created separate manifest files for Chrome and Firefox
  - Updated build system to support multiple browsers
  - Added browser-specific build commands

### Fixed
- Background script configuration for Chrome MV3 (service_worker)

## [1.0.0] - 2024-01-15
### Added
- Quick tab switching with intuitive search interface
- Real-time fuzzy search for tabs and bookmarks
- Smart URL detection and direct opening capability
- Comprehensive keyboard navigation with arrow keys and Enter/Esc controls
- Bookmark integration with search results
- Fallback Google search when no matches are found
- Custom keyboard shortcuts:
  - Mac: Command+Shift+K
  - Windows/Linux: Alt+T
- Smart result categorization:
  - Tabs with direct switching
  - Bookmarks opening in new tabs
  - Direct URL opening
  - Google search fallback
- Toolbar icon for mouse-based activation

### Security
- Implemented minimum required permissions model
- Secure handling of browser APIs and user data
- Safe bookmark access implementation

## Types of Changes
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.
