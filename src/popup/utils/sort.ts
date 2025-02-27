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
 * Calculate smart sort score
 * Simple ranking rules:
 * - Items accessed within 24 hours rank highest
 * - Items accessed within a week rank second
 * - Others sorted by access count
 */
const calculateSmartScore = (result: SearchResult): number => {
  if (!result.lastAccessed || !result.accessCount) {
    return 0;
  }

  const now = Date.now();
  const daysPassed = (now - result.lastAccessed) / (1000 * 60 * 60 * 24);
  
  // Simple ranking rules
  if (daysPassed < 1) {  // Accessed within 24 hours
    return 100 + (result.accessCount || 0);  // Highest priority, use access count for fine-tuning
  } else if (daysPassed < 7) {  // Accessed within a week
    return 50 + (result.accessCount || 0);   // Second priority
  } else {
    return result.accessCount || 0;          // Sort by access count only
  }
};

/**
 * Sort search results based on settings
 * @param results Search results
 * @param settings Sort settings
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
  
  // Sort based on method
  switch (settings.method) {
    case 'relevance':
      // Sort by relevance (keep unchanged)
      return resultsWithUsage;
      
    case 'usage':
      // Sort by usage (consider both frequency and recent use)
      return resultsWithUsage.sort((a, b) => {
        const now = Date.now();
        const aHoursPassed = (now - (a.lastAccessed || 0)) / (1000 * 60 * 60);
        const bHoursPassed = (now - (b.lastAccessed || 0)) / (1000 * 60 * 60);
        
        // If one is recently accessed (within 24 hours) and the other isn't, prioritize recent
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
      // Smart sort (prioritize recent access)
      return resultsWithUsage.sort((a, b) => {
        const now = Date.now();
        const aHoursPassed = (now - (a.lastAccessed || 0)) / (1000 * 60 * 60);
        const bHoursPassed = (now - (b.lastAccessed || 0)) / (1000 * 60 * 60);
        
        // Tabs accessed within 24 hours get highest priority (base score 100)
        if (aHoursPassed <= 24 && bHoursPassed > 24) return -1;
        if (bHoursPassed <= 24 && aHoursPassed > 24) return 1;
        
        // If both accessed within 24 hours, sort by access time
        if (aHoursPassed <= 24 && bHoursPassed <= 24) {
          return (b.lastAccessed || 0) - (a.lastAccessed || 0);
        }
        
        // Tabs accessed within a week get second priority (base score 50)
        const aDaysPassed = aHoursPassed / 24;
        const bDaysPassed = bHoursPassed / 24;
        if (aDaysPassed <= 7 && bDaysPassed > 7) return -1;
        if (bDaysPassed <= 7 && aDaysPassed > 7) return 1;
        
        // If both accessed within a week, consider both time and count
        if (aDaysPassed <= 7 && bDaysPassed <= 7) {
          const aScore = (a.accessCount || 0) * 10 + (7 - aDaysPassed) * 5;
          const bScore = (b.accessCount || 0) * 10 + (7 - bDaysPassed) * 5;
          return bScore - aScore;
        }
        
        // Otherwise sort by access count
        return (b.accessCount || 0) - (a.accessCount || 0);
      });
      
    default:
      return resultsWithUsage;
  }
}; 