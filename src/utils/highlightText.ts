export const highlightSearchText = (text: string, query: string): string => {
  if (!query) return text;
  
  const words = query.trim().split(/\s+/);
  let highlightedText = text;
  
  // Sort words by length (longest first) to prevent partial word highlighting
  words.sort((a, b) => b.length - a.length);
  
  words.forEach(word => {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedWord})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>');
  });
  
  return highlightedText;
};