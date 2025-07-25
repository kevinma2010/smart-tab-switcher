# Smart Tab Switcher

A browser extension for fast tab switching and management through real-time search and keyboard navigation. Perfect for users managing multiple tabs daily.

## Key Features

- 🚀 **Quick Launch**: `Command+Shift+K` (Mac) or `Alt+T` (Windows/Linux)
- 🔍 **Real-time Search**: Fuzzy search across tabs and bookmarks
- ⌨️ **Keyboard Navigation**: Arrow keys, Tab/Shift+Tab, Enter, Escape, Delete to close tabs
- 🎯 **Query Modes**: Filter results with prefixes (`b:` bookmarks, `u:` URLs, `g:` Google)
- 🧠 **Smart Sorting**: Combines relevance, frequency, and usage patterns
- 🌐 **Universal Search**: Handles URLs and Google search when no matches found
- 🎨 **Theme Support**: Auto dark/light mode
- ⚙️ **Customizable**: Shortcuts, sorting preferences, enter key behavior

## User Guide

### Installation

Install from your browser's extension store:

<div align="center">

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/jjjkdlhleiedpjijkfofahkjfoehamok?label=Chrome&style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/jjjkdlhleiedpjijkfofahkjfoehamok)
[![Firefox Add-ons](https://img.shields.io/amo/v/smart-tab-switcher?label=Firefox&style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/firefox/addon/smart-tab-switcher)

</div>

Or download from [GitHub Releases](https://github.com/kevinma2010/smart-tab-switcher/releases) and load manually in your browser's developer mode.

### How to Use

1. **Launch**: Press `Command+Shift+K` (Mac) or `Alt+T` (Windows/Linux), or click the extension icon
   - Customize shortcuts in browser settings

2. **Search**: Type to find tabs/bookmarks
   - Use query modes: `b:` bookmarks only, `u:` include URLs, `g:` Google search only
   - Navigation: Arrow keys or Tab/Shift+Tab
   - Actions: Enter to open, Delete to close tabs, Esc to exit

3. **Results**: Switches to tabs, opens bookmarks in new tabs, handles URLs directly, or searches Google when no matches found
   - Click the × button to close tabs
   - Configure Enter key behavior in settings (current tab vs new tab)

## Developer Guide

For comprehensive development documentation including setup, architecture, and deployment, see [DEVELOPER.md](./DEVELOPER.md). For release process, see [RELEASE.md](./RELEASE.md). For contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Quick Start

```bash
# Clone and install
git clone https://github.com/kevinma2010/smart-tab-switcher.git
cd smart-tab-switcher
pnpm install

# Start development
pnpm dev:chrome  # For Chrome
pnpm dev:firefox # For Firefox
```

For detailed development instructions, architecture documentation, and deployment guides, please refer to [DEVELOPER.md](./DEVELOPER.md).

## License

Licensed under GNU General Public License v3.0. See [LICENSE](./LICENSE) for details.

## Support & Feedback

- [GitHub Issues](https://github.com/kevinma2010/smart-tab-switcher/issues)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.