export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
  ) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return (...args: Parameters<F>): Promise<ReturnType<F>> => {
      if (timeout) {
        clearTimeout(timeout);
      }
  
      return new Promise(resolve => {
        timeout = setTimeout(() => {
          resolve(func(...args));
        }, waitFor);
      });
    };
  };
  
  export const calculateScore = (
    query: string,
    text: string,
    weight: number = 1
  ): number => {
    query = query.toLowerCase();
    text = text.toLowerCase();
  
    if (text.startsWith(query)) {
      return 1 * weight;
    }
  
    if (text.includes(query)) {
      return 0.8 * weight;
    }
  
    // Simple implementation of edit distance calculation
    const words = text.split(/\s+/);
    const queryWords = query.split(/\s+/);
  
    const hasMatchingWord = words.some(word =>
      queryWords.some(queryWord => word.includes(queryWord))
    );
  
    return hasMatchingWord ? 0.5 * weight : 0;
  };