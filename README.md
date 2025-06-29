# Smart Tab Switcher

Smart Tab Switcher is a powerful browser extension that provides lightning-fast tab switching and management through real-time search, intelligent sorting, and comprehensive keyboard navigation. Designed for power users who work with multiple tabs daily.

## ✨ Key Features

- 🚀 **Quick Launch**: Trigger with `Command+Shift+K` (Mac) or `Alt+T` (Windows/Linux)
- 🔍 **Real-time Search**: Instantly search through open tabs and bookmarks with fuzzy matching
- ⌨️ **Keyboard-Centric**: Complete keyboard navigation with arrow keys, Enter, Escape
- ✖️ **Smart Tab Closing**: Close tabs directly from search results with hover button or `Delete` key
- 🧠 **Intelligent Sorting**: Smart algorithm combining relevance, frequency, and recency
- ⭐ **Usage Tracking**: Visual indicators showing tab usage frequency and last access time
- 🔖 **Bookmark Integration**: Search through bookmarks seamlessly alongside tabs
- 🌐 **URL Recognition**: Smart URL detection and direct opening
- 🔄 **Google Search**: Instant Google search when no local matches found
- 🎨 **Theme Support**: Automatic dark/light mode based on system preferences
- ⚙️ **Customizable Settings**: Personalize sorting methods and navigation behavior

## 📖 User Guide

### Installation

You can install Smart Tab Switcher from your browser's extension store:

<div align="center">

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/jjjkdlhleiedpjijkfofahkjfoehamok?label=Chrome&style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/jjjkdlhleiedpjijkfofahkjfoehamok)
[![Firefox Add-ons](https://img.shields.io/amo/v/smart-tab-switcher?label=Firefox&style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/firefox/addon/smart-tab-switcher)
[![Edge Add-ons](https://img.shields.io/badge/Edge-v1.0.0-blue?style=for-the-badge&logo=microsoft-edge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/smart-tab-switcher)

</div>

Or install manually:
1. Download the latest release from [GitHub Releases](https://github.com/kevinma2010/smart-tab-switcher/releases)
2. Follow the browser-specific installation steps below:
   - Chrome/Edge:
     * Go to Extensions page
     * Enable Developer mode
     * Click "Load unpacked"
     * Select the extracted release folder
   - Firefox:
     * Go to `about:debugging`
     * Click "This Firefox"
     * Click "Load Temporary Add-on"
     * Select `manifest.json` from the extracted folder

### How to Use

1. **Launch Search**
   - Mac: Press `Command+Shift+K`
   - Windows/Linux: Press `Alt+T`
   - Or click the extension icon in the toolbar

2. **Search and Navigate**
   - Type keywords to search tabs and bookmarks
   - Use ↑↓ keys to navigate results
   - Press Enter to open selected item
   - Press Esc to close search interface

3. **Tab Management**
   - **Close tabs**: Hover over tab results to see close button (×) and click it
   - **Keyboard shortcut**: Press `Delete` key to close selected tab
   - **Multiple actions**: Switch to or close tabs without leaving the search interface

4. **Search Result Types**
   - 📑 **Tabs**: Switch directly to the corresponding tab or close it
   - 🔖 **Bookmarks**: Open in a new tab
   - 🌐 **URLs**: Direct opening when URL is detected
   - 🔍 **Google**: Search when no matches found

5. **Customization**
   - Access settings through the extension popup
   - Customize sorting preferences (relevance, frequency, recency)
   - Adjust navigation behavior and display options

## 💻 Developer Guide

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- Browser (Chrome v88+ / Firefox v109.0+ / Edge v88+)

### Local Development

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

### Build for Production

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

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.

The GPLv3 License means:
- ✅ You can view and modify the source code
- ✅ You can redistribute the code
- ✅ You must keep the same license for derivative works
- ✅ You must disclose the source code of derivative works
- ❌ You cannot use the code in proprietary/closed source projects
- ❌ You cannot modify the license terms

For more details, please see the full [license text](./LICENSE).

## 📞 Support & Feedback

- [GitHub Issues](https://github.com/kevinma2010/smart-tab-switcher/issues)

## 🔄 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.