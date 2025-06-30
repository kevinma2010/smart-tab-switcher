# Query Modes Technical Implementation

## Overview
This document outlines the technical implementation of the Query Modes feature, which allows users to filter search results using prefix symbols (`b:`, `u:`, `g:`).

## Architecture

### Core Components
1. **Query Parser**: Detects and extracts mode prefixes from user input
2. **Search Mode Manager**: Manages current search mode state
3. **Search Filter**: Applies mode-specific filtering logic to search results

### Data Flow
```
User Input → Query Parser → Search Mode Update → Filtered Search → Results Display
```

## Implementation Details

### 1. Type System Extensions

#### New Types
```typescript
// Search mode enumeration
type SearchMode = 'all' | 'bookmarks' | 'urls' | 'google';

// Extended search options
interface SearchOptions {
  includeBookmarks?: boolean;
  includeTabs?: boolean;
  limit?: number;
  mode?: SearchMode; // New optional field
}
```

### 2. Query Parsing Logic

#### Prefix Detection
- **Pattern**: `/^([bug]):/i` - Case-insensitive prefix detection
- **Supported Prefixes**:
  - `b:` → `'bookmarks'` mode
  - `u:` → `'urls'` mode  
  - `g:` → `'google'` mode
  - No prefix → `'all'` mode (default)

#### Implementation
```typescript
function parseQueryForMode(input: string): { mode: SearchMode; cleanQuery: string } {
  const prefixMatch = input.match(/^([bug]):/i);
  
  if (!prefixMatch) {
    return { mode: 'all', cleanQuery: input };
  }
  
  const prefix = prefixMatch[1].toLowerCase();
  const cleanQuery = input.slice(2).trim();
  
  const modeMap: Record<string, SearchMode> = {
    'b': 'bookmarks',
    'u': 'urls', 
    'g': 'google'
  };
  
  return { mode: modeMap[prefix] || 'all', cleanQuery };
}
```

### 3. Search Mode Filtering

#### Mode-Specific Behavior

**All Mode (Default)**
- Search tabs and bookmarks
- Include URL suggestions for valid URLs
- Include Google search suggestions
- Current behavior preserved

**Bookmarks Mode (`b:`)**
- Only search bookmarks array using Fuse.js
- Skip tab searching entirely
- No URL or Google suggestions
- Results limited to bookmark matches

**URLs Mode (`u:`)**
- Search both tabs and bookmarks
- Always include URL suggestion if query is valid URL
- No Google search suggestions
- Focus on URL-based results

**Google Mode (`g:`)**
- Skip all tab/bookmark searching
- Only return Google search suggestion
- Immediate search redirection

### 4. Hook Integration

#### State Management
```typescript
const [searchMode, setSearchMode] = useState<SearchMode>('all');
const [cleanQuery, setCleanQuery] = useState('');
```

#### Query Handler
```typescript
const handleQueryChange = useCallback((input: string) => {
  const { mode, cleanQuery } = parseQueryForMode(input);
  setSearchMode(mode);
  setCleanQuery(cleanQuery);
  setQuery(input); // Keep original for display
}, []);
```

#### Search Function Updates
```typescript
const search = useCallback((searchQuery: string, options: SearchOptions = {}) => {
  const { mode: optionsMode } = options;
  const currentMode = optionsMode || searchMode;
  
  // Apply mode-specific filtering
  switch (currentMode) {
    case 'bookmarks':
      return searchBookmarksOnly(cleanQuery, options);
    case 'urls':
      return searchUrlsMode(cleanQuery, options);
    case 'google':
      return searchGoogleOnly(cleanQuery);
    default:
      return searchAll(cleanQuery, options); // Existing logic
  }
}, [searchMode, cleanQuery, tabs, bookmarks, ...]);
```

### 5. Search Implementation Functions

#### Bookmarks Only Search
```typescript
function searchBookmarksOnly(query: string, options: SearchOptions): SearchResult[] {
  if (!query.trim()) return [];
  
  const bookmarksFuse = new Fuse(bookmarks, SEARCH_OPTIONS);
  const results = bookmarksFuse.search(query);
  
  return results.map(({ item, score }) => ({
    ...item,
    type: 'bookmark' as const,
    score
  }));
}
```

#### URLs Mode Search  
```typescript
function searchUrlsMode(query: string, options: SearchOptions): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Search tabs and bookmarks as usual
  const standardResults = searchTabsAndBookmarks(query, options);
  results.push(...standardResults);
  
  // Always try to add URL suggestion if valid
  if (isValidUrl(query)) {
    const potentialUrl = query.startsWith('http') ? query : `https://${query}`;
    results.push({
      id: 'url-' + query,
      type: 'url',
      title: 'Open URL',
      url: potentialUrl
    });
  }
  
  return results;
}
```

#### Google Only Search
```typescript
function searchGoogleOnly(query: string): SearchResult[] {
  if (!query.trim()) return [];
  
  return [{
    id: 'google-' + query,
    type: 'google',
    title: `Search Google for "${query}"`,
    url: `https://www.google.com/search?q=${encodeURIComponent(query)}`
  }];
}
```

## Integration Points

### Component Updates
- `SearchBox`: No changes required (maintains existing query display)
- `SearchView`: No changes required (uses existing search hook)
- `ResultList`: No changes required (handles all result types)

### Hook Interface
- `useSearch()` return value remains unchanged
- Internal state management enhanced with mode tracking
- Backward compatibility maintained

## Testing Strategy

### Unit Tests
1. **Query Parser Tests**
   - Prefix detection accuracy
   - Case insensitivity validation
   - Clean query extraction

2. **Mode Filtering Tests**
   - Bookmarks-only results
   - URLs mode behavior
   - Google-only results
   - Default mode preservation

### Integration Tests
1. **Search Flow Tests**
   - End-to-end search with prefixes
   - Mode switching during session
   - Result type validation

### Manual Testing Scenarios
1. Search with `b:react` → Only bookmark results
2. Search with `u:github.com` → URL + relevant results  
3. Search with `g:javascript tutorial` → Google search only
4. Search with `react` → All results (existing behavior)

## Performance Considerations

### Optimizations
- Mode detection is O(1) regex operation
- Early returns for specialized modes reduce search overhead
- Existing Fuse.js performance maintained
- No additional memory overhead

### Memory Impact
- Minimal state additions (2 additional state variables)
- No duplication of search indexes
- Reuse of existing search infrastructure

## Future Enhancements

### Phase 2 Features
- **Visual Mode Indicators**: Placeholder text changes, mode badges
- **Custom Prefix Configuration**: User-defined prefixes in settings
- **Additional Modes**: History search (`h:`), recent tabs (`r:`)
- **Mode Combinations**: Multiple mode support (`b:u:query`)

### Extensibility
- Mode system designed for easy addition of new modes
- Parser supports dynamic prefix registration
- Search filtering architecture supports complex mode logic

## Backward Compatibility

### Guarantees
- All existing functionality preserved
- No breaking changes to public interfaces
- Default behavior unchanged when no prefix used
- Existing keyboard shortcuts and interactions maintained

### Migration Path
- Zero migration required for existing users
- Feature is opt-in through prefix usage
- Progressive enhancement approach