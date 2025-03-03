# Changelog
All notable changes to Quick Tab Switcher will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-03-02
### Added
- About view with version and project information
- Onboarding experience for new users
- User guide button in About and Settings views

### Changed
- Enhanced empty search results view layout and styling
- Improved settings button styling and alignment in search view
- Updated webpack and dependencies to latest versions

### Build
- Added clean scripts for Chrome and Firefox build processes
- Added release build script
- Updated documentation with Chrome Web Store link

## [1.1.0] - 2024-03-27
### Added
- Advanced sorting optimization:
  - Smart sorting algorithm combining relevance, frequency, and recency
  - Usage-based sorting with access frequency tracking
  - Recency-based sorting using last access time
  - Settings page for customizing sort methods
  - Visual indicators for usage frequency (star rating)
  - Last accessed time display in search results
- Usage data management:
  - Automatic tracking of tab access patterns
  - Periodic cleanup of outdated usage data
  - Memory optimization for long-term usage

### Changed
- Enhanced bookmark handling:
  - Display opened bookmarks as tabs in search results
  - Maintain original bookmark type for unopened bookmarks
- Improved result item display:
  - Added frequency indicators (0-5 stars)
  - Added relative time display
  - Better visual organization of metadata

## [1.0.1] - 2024-03-26
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
