# Query Modes Feature Design

## 1. Feature Description
This feature allows users to quickly switch between different search modes (bookmarks, URLs, Google search) by typing a specific prefix symbol in the search box. This aims to improve efficiency for advanced users by reducing steps to access specific content types.

## 2. Proposed Solution
Implement a mechanism to parse the search query for predefined prefix symbols. Based on the detected prefix, the search logic will filter results to only include items relevant to that mode.

### 2.1 Prefix Symbols (Default)
*   **Bookmarks:** `b:`
*   **URLs:** `u:`
*   **Google Search:** `g:`

These symbols are chosen for their intuitiveness and potential for future customizability.

### 2.2 Search Logic Modification
The `useSearch` hook (specifically the `search` function) will be modified to:
1.  Identify if the input query starts with any of the defined prefix symbols.
2.  If a prefix is found:
    *   Set an internal `searchMode` state (e.g., 'bookmarks', 'urls', 'google').
    *   Remove the prefix from the query string before passing it to the underlying search (Fuse.js).
3.  Based on the `searchMode`:
    *   **'all' (default):** Current behavior, search tabs, bookmarks, and suggest URL/Google.
    *   **'bookmarks':** Only search within bookmarks.
    *   **'urls':** Search within tabs and bookmarks for URL matches, and suggest direct URL opening.
    *   **'google':** Only suggest a Google search for the remaining query.

### 2.3 Simplified Visual Feedback (Phase 1)
For the initial phase, visual feedback will be minimal, focusing on functional experience:
*   The search results will simply reflect the filtered content based on the active mode.
*   No explicit UI indicators (like changing placeholder text or adding mode labels) will be implemented in this phase. This can be considered for future enhancements.

## 3. Technical Implementation Details

### 3.1 `src/popup/hooks/use-search-complete.tsx` Modifications
*   Introduce a new state variable `searchMode` (e.g., `useState<'all' | 'bookmarks' | 'urls' | 'google'>('all')`).
*   Modify the `setQuery` function (or introduce a new handler like `handleQueryChange`) to:
    *   Check for `b:`, `u:`, `g:` prefixes.
    *   Update `searchMode` accordingly.
    *   Update the actual `query` state with the prefix-stripped string.
*   Adjust the `search` useCallback function to use the `searchMode` state to conditionally filter results from `tabs` and `bookmarks` arrays, and to control the inclusion of URL and Google search suggestions.

## 4. Future Considerations
*   **User Customization:** Allow users to define their own prefix symbols in the settings.
*   **Enhanced Visual Feedback:** Implement UI elements to clearly indicate the active search mode (e.g., placeholder text changes, mode icons).
*   **Additional Modes:** Extend to other search types like history, specific file types, etc.
*   **Mode Combination:** Explore advanced scenarios where multiple modes can be combined (e.g., searching bookmarks with a specific tag).
