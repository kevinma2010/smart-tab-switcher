# Quick Tab Switcher for Firefox

Quick Tab Switcher is a powerful Firefox extension that helps users efficiently manage and switch browser tabs through an intuitive interface and quick search functionality.

![Quick Tab Switcher Screenshot](./screenshots/demo.png)

## ✨ Key Features

- 🚀 Quick Launch: Trigger with `Command+Shift+K` (Mac) or `Alt+T` (Windows/Linux)
- 🔍 Real-time Search: Instantly search through open tabs and bookmarks
- ⌨️ Keyboard-Centric: Complete keyboard navigation support
- 🎯 Smart Matching: Fuzzy search for quick target page location
- 🔖 Bookmark Integration: Search results include bookmarks for quick access
- 🌐 URL Recognition: Smart URL detection and direct opening
- 🔄 Google Search: Direct Google search when no matches found

## 📖 User Guide

### Installation

1. Visit Firefox Add-ons Store
2. Search for "Quick Tab Switcher"
3. Click "Add to Firefox"

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

3. **Search Result Types**
   - 📑 Tabs: Switch directly to the corresponding tab
   - 🔖 Bookmarks: Open in a new tab
   - 🌐 URLs: Direct opening when URL is detected
   - 🔍 Google: Search when no matches found

## 💻 Developer Guide

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Firefox Browser (v109.0+)

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/quick-tab-switcher.git
   cd quick-tab-switcher
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```

4. **Load in Firefox**
   - Navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `manifest.json` from the `dist` directory

### Build for Production

```bash
npm run build
```

Built files will be located in the `dist` directory.

### Project Structure

```
src/
├── background/        # Background scripts
├── popup/            # Popup interface
│   ├── components/   # React components
│   ├── hooks/        # Custom Hooks
│   └── utils/        # Utility functions
├── icons/            # Icon resources
└── manifest.json     # Extension configuration
```

### Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Fuse.js
- Firefox WebExtensions API (MV3)

### Development Documentation

For detailed technical documentation and development guidelines, please refer to [DEVELOPER.md](./DEVELOPER.md)

## 🤝 Contributing

We welcome all forms of contributions, including but not limited to:

- 🐛 Bug Reports
- 💡 Feature Suggestions
- 📝 Documentation Improvements
- 🔧 Code Contributions

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute.

## 📄 License

This project is open-sourced under the MIT License - see [LICENSE](./LICENSE) file for details.

## 📞 Support & Feedback

- Submit Issues: [GitHub Issues](https://github.com/yourusername/quick-tab-switcher/issues)
- Contact Email: support@example.com

## 🔄 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.