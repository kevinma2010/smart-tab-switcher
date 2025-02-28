import { SearchResult, SortSettings, TabUsageData } from '../types';

// Calculate time decay score
const getTimeScore = (lastAccessed: number): number => {
  const now = Date.now();
  const hoursPassed = (now - lastAccessed) / (1000 * 60 * 60);
  return Math.exp(-hoursPassed / 24); // 24 hours as decay base
};

// Calculate frequency score
const getFrequencyScore = (accessCount: number, lastAccessed: number): number => {
  const now = Date.now();
  // Use last access time as time span, avoiding need to store first access time
  const daysPassed = (now - lastAccessed) / (1000 * 60 * 60 * 24);
  // Calculate average daily access frequency (minimum 1 day, avoid division by 0)
  const daysForCalculation = Math.max(1, daysPassed);
  const dailyFrequency = accessCount / daysForCalculation;
  
  // Normalize frequency score
  return Math.min(1, dailyFrequency / 5);
};

/**
 * Calculate smart sorting score
 * Simple grading rules:
 * - Tabs accessed in the last 24 hours are at the top
 * - Tabs accessed in the last week are next
 * - Others are sorted by access count
 */
const calculateSmartScore = (result: SearchResult): number => {
  if (!result.lastAccessed || !result.accessCount) {
    return 0;
  }

  const now = Date.now();
  const daysPassed = (now - result.lastAccessed) / (1000 * 60 * 60 * 24);
  
  // Simple grading rules
  if (daysPassed < 1) {  // Tabs accessed in the last 24 hours
    return 100 + (result.accessCount || 0);  // Highest priority, access count as a fine-tuning
  } else if (daysPassed < 7) {  // Tabs accessed in the last week
    return 50 + (result.accessCount || 0);   // Second highest priority
  } else {
    return result.accessCount || 0;          // Sort by access count
  }
};

/**
 * Sort search results based on settings
 * @param results Search results
 * @param settings Sorting settings
 * @param usageData Usage data
 * @returns Sorted results
 */
export const sortResults = (
  results: SearchResult[], 
  settings: SortSettings, 
  usageData: TabUsageData
): SearchResult[] => {
  // Add usage data to results
  const resultsWithUsage = results.map(result => {
    const usage = usageData[result.url];
    return {
      ...result,
      accessCount: usage?.accessCount || 0,
      lastAccessed: usage?.lastAccessed || 0
    };
  });
  
  // Sort results based on sorting method
  switch (settings.method) {
    case 'relevance':
      // Keep relevance order (unchanged)
      return resultsWithUsage;
      
    case 'usage':
      // Sort by usage records (consider access frequency and recent usage time)
      return resultsWithUsage.sort((a, b) => {
        const now = Date.now();
        const aHoursPassed = (now - (a.lastAccessed || 0)) / (1000 * 60 * 60);
        const bHoursPassed = (now - (b.lastAccessed || 0)) / (1000 * 60 * 60);
        
        // If one is recently accessed (within 24 hours) and the other is not, display the recently accessed one first
        if (aHoursPassed <= 24 && bHoursPassed > 24) return -1;
        if (bHoursPassed <= 24 && aHoursPassed > 24) return 1;
        
        // If both are recently accessed, sort by access time
        if (aHoursPassed <= 24 && bHoursPassed <= 24) {
          return (b.lastAccessed || 0) - (a.lastAccessed || 0);
        }
        
        // If neither is recently accessed, sort by access count
        return (b.accessCount || 0) - (a.accessCount || 0);
      });
      
    case 'smart':
      // Smart sorting (prioritize recent access)
      return resultsWithUsage.sort((a, b) => {
        const now = Date.now();
        const aHoursPassed = (now - (a.lastAccessed || 0)) / (1000 * 60 * 60);
        const bHoursPassed = (now - (b.lastAccessed || 0)) / (1000 * 60 * 60);
        
        // Tabs accessed in the last 24 hours get the highest priority (base score 100)
        if (aHoursPassed <= 24 && bHoursPassed > 24) return -1;
        if (bHoursPassed <= 24 && aHoursPassed > 24) return 1;
        
        // If both are accessed in the last 24 hours, sort by access time
        if (aHoursPassed <= 24 && bHoursPassed <= 24) {
          return (b.lastAccessed || 0) - (a.lastAccessed || 0);
        }
        
        // Tabs accessed in the last week get the next priority (base score 50)
        const aDaysPassed = aHoursPassed / 24;
        const bDaysPassed = bHoursPassed / 24;
        if (aDaysPassed <= 7 && bDaysPassed > 7) return -1;
        if (bDaysPassed <= 7 && aDaysPassed > 7) return 1;
        
        // If both are accessed in the last week, consider access time and count
        if (aDaysPassed <= 7 && bDaysPassed <= 7) {
          const aScore = (a.accessCount || 0) * 10 + (7 - aDaysPassed) * 5;
          const bScore = (b.accessCount || 0) * 10 + (7 - bDaysPassed) * 5;
          return bScore - aScore;
        }
        
        // Sort by access count in other cases
        return (b.accessCount || 0) - (a.accessCount || 0);
      });
      
    default:
      return resultsWithUsage;
  }
}; 