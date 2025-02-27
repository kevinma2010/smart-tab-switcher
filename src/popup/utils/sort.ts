import { SearchResult, SortSettings, TabUsageData } from '../types';

// 计算时间衰减分数
const getTimeScore = (lastAccessed: number): number => {
  const now = Date.now();
  const hoursPassed = (now - lastAccessed) / (1000 * 60 * 60);
  return Math.exp(-hoursPassed / 24); // 24小时作为衰减基准
};

// 计算频率分数
const getFrequencyScore = (accessCount: number, lastAccessed: number): number => {
  const now = Date.now();
  // 使用最后访问时间作为时间跨度，避免需要存储首次访问时间
  const daysPassed = (now - lastAccessed) / (1000 * 60 * 60 * 24);
  // 计算平均每天的访问频率（最小为1天，避免除以0）
  const daysForCalculation = Math.max(1, daysPassed);
  const dailyFrequency = accessCount / daysForCalculation;
  
  // 归一化频率分数
  return Math.min(1, dailyFrequency / 5);
};

/**
 * 计算智能排序分数
 * 简单的分级规则：
 * - 24小时内访问过的排最前面
 * - 一周内访问过的次之
 * - 其他按访问次数排序
 */
const calculateSmartScore = (result: SearchResult): number => {
  if (!result.lastAccessed || !result.accessCount) {
    return 0;
  }

  const now = Date.now();
  const daysPassed = (now - result.lastAccessed) / (1000 * 60 * 60 * 24);
  
  // 简单的分级规则
  if (daysPassed < 1) {  // 24小时内访问过
    return 100 + (result.accessCount || 0);  // 最高优先级，访问次数作为微调
  } else if (daysPassed < 7) {  // 一周内访问过
    return 50 + (result.accessCount || 0);   // 次高优先级
  } else {
    return result.accessCount || 0;          // 仅按访问次数排序
  }
};

/**
 * 根据设置对搜索结果进行排序
 * @param results 搜索结果
 * @param settings 排序设置
 * @param usageData 使用数据
 * @returns 排序后的结果
 */
export const sortResults = (
  results: SearchResult[], 
  settings: SortSettings, 
  usageData: TabUsageData
): SearchResult[] => {
  // 为结果添加使用数据
  const resultsWithUsage = results.map(result => {
    const usage = usageData[result.url];
    return {
      ...result,
      accessCount: usage?.accessCount || 0,
      lastAccessed: usage?.lastAccessed || 0
    };
  });
  
  // 根据排序方法进行排序
  switch (settings.method) {
    case 'relevance':
      // 按相关度排序（保持不变）
      return resultsWithUsage;
      
    case 'usage':
      // 按使用记录排序（综合考虑访问频率和最近使用时间）
      return resultsWithUsage.sort((a, b) => {
        const now = Date.now();
        const aHoursPassed = (now - (a.lastAccessed || 0)) / (1000 * 60 * 60);
        const bHoursPassed = (now - (b.lastAccessed || 0)) / (1000 * 60 * 60);
        
        // 如果一个是最近（24小时内）访问的，一个不是，优先显示最近的
        if (aHoursPassed <= 24 && bHoursPassed > 24) return -1;
        if (bHoursPassed <= 24 && aHoursPassed > 24) return 1;
        
        // 如果都是最近访问的，按访问时间排序
        if (aHoursPassed <= 24 && bHoursPassed <= 24) {
          return (b.lastAccessed || 0) - (a.lastAccessed || 0);
        }
        
        // 如果都不是最近访问的，按访问次数排序
        return (b.accessCount || 0) - (a.accessCount || 0);
      });
      
    case 'smart':
      // 智能排序（优先考虑最近访问）
      return resultsWithUsage.sort((a, b) => {
        const now = Date.now();
        const aHoursPassed = (now - (a.lastAccessed || 0)) / (1000 * 60 * 60);
        const bHoursPassed = (now - (b.lastAccessed || 0)) / (1000 * 60 * 60);
        
        // 24小时内访问的标签页得到最高优先级（基础分100）
        if (aHoursPassed <= 24 && bHoursPassed > 24) return -1;
        if (bHoursPassed <= 24 && aHoursPassed > 24) return 1;
        
        // 如果都是24小时内访问的，按访问时间排序
        if (aHoursPassed <= 24 && bHoursPassed <= 24) {
          return (b.lastAccessed || 0) - (a.lastAccessed || 0);
        }
        
        // 一周内访问的标签页次优先（基础分50）
        const aDaysPassed = aHoursPassed / 24;
        const bDaysPassed = bHoursPassed / 24;
        if (aDaysPassed <= 7 && bDaysPassed > 7) return -1;
        if (bDaysPassed <= 7 && aDaysPassed > 7) return 1;
        
        // 如果都是一周内访问的，综合考虑访问时间和次数
        if (aDaysPassed <= 7 && bDaysPassed <= 7) {
          const aScore = (a.accessCount || 0) * 10 + (7 - aDaysPassed) * 5;
          const bScore = (b.accessCount || 0) * 10 + (7 - bDaysPassed) * 5;
          return bScore - aScore;
        }
        
        // 其他情况按访问次数排序
        return (b.accessCount || 0) - (a.accessCount || 0);
      });
      
    default:
      return resultsWithUsage;
  }
}; 