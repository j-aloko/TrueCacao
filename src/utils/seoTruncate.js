export function truncateForMetaDescription(text, maxLength) {
  if (!text || text.length <= maxLength) return text;

  // Find the last space within maxLength for cleaner truncation
  const truncatedText = text.slice(0, maxLength);
  const lastSpaceIndex = truncatedText.lastIndexOf(' ');

  return lastSpaceIndex > 0
    ? `${truncatedText.slice(0, lastSpaceIndex)}...`
    : `${truncatedText}...`;
}
