export const isValidUrl = (urlString: string): boolean => {
    try {
      // Fix common URL input
      if (!urlString.match(/^[a-zA-Z]+:\/\//)) {
        urlString = 'https://' + urlString;
      }
      
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };
  
  export const normalizeUrl = (url: string): string => {
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      return 'https://' + url;
    }
    return url;
  };