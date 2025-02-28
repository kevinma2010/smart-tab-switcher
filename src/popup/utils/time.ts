/**
 * Format timestamp to relative time text
 * @param timestamp Timestamp (milliseconds)
 * @returns Formatted relative time text
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Less than 1 minute
  if (diff < 60 * 1000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} minutes ago`;
  }
  
  // Less than 1 day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} hours ago`;
  }
  
  // Less than 30 days
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} days ago`;
  }
  
  // More than 30 days
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}; 