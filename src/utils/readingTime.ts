export function calculateReadingTime(content: string): number {
  if (!content) return 1;

  // Remove HTML tags and extra whitespace
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ')    // Replace multiple whitespace with single space
    .trim();

  // Average reading speed is 200-250 words per minute
  // We'll use 225 words per minute as a middle ground
  const wordsPerMinute = 225;
  const wordCount = plainText.split(' ').filter(word => word.length > 0).length;

  // Calculate reading time in minutes, minimum 1 minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return readingTimeMinutes;
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}