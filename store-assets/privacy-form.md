# Chrome Web Store Privacy Form Content

## Single Purpose Description
This extension provides a quick tab switcher that allows users to search and switch between open tabs and bookmarks using keyboard shortcuts, making browser navigation more efficient.

## Data Collection Declaration
- Select: "This application does not collect or use any data"

## Required Permissions

### Tabs Permission
- **Purpose**: To access and search through open tabs
- **Usage**: Only used when the user actively uses the extension to switch tabs
- **Data Access**: Local access only, no data collection or external transmission
- **Justification**: The tabs permission is required to access and search through open tabs when users activate the extension. This allows users to quickly find and switch to their desired tab. The extension only accesses tab information when actively being used and processes all data locally.

### Bookmarks Permission
- **Purpose**: To search through bookmarks
- **Usage**: Only used when searching for bookmarks within the extension
- **Data Access**: Local access only, no data collection or external transmission
- **Justification**: The bookmarks permission is needed to search through user's bookmarks when they use the extension's search feature. This enables users to quickly find and open their saved bookmarks. All bookmark data is accessed locally and no data is transmitted externally.

### Storage Permission
- **Purpose**: To store extension preferences and usage data
- **Usage**: Stores user settings and tab access patterns locally
- **Data Access**: Local storage only, no external transmission
- **Justification**: The storage permission is required to save user preferences (like sorting methods) and maintain tab usage statistics (frequency and last access time) to provide smart sorting functionality. All data is stored locally in the browser and is never transmitted externally. This data helps improve the user experience by providing personalized tab sorting based on usage patterns.

### Alarms Permission
- **Purpose**: To schedule periodic maintenance tasks
- **Usage**: Used to clean up outdated usage data
- **Data Access**: Local access only, no external transmission
- **Justification**: The alarms permission is needed to periodically clean up old tab usage data to prevent excessive storage usage. This maintenance task runs in the background at set intervals to optimize memory usage and maintain extension performance. All operations are performed locally within the browser.

## Remote Code Usage
- Select: "No, I am not using remote code"

## Security Practices
- All data processing is performed locally within the browser
- No data is shared with third parties
- No data is stored on external servers
- No personal information is collected
- No browsing history is tracked

## Privacy Policy Link
https://github.com/kevinma2010/smart-tab-switcher/blob/main/PRIVACY.md 