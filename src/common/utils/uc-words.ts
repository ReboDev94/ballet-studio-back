export const ucwords = (wordP: string) => {
  if (!wordP) return '';
  return wordP
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
