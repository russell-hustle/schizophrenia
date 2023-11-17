/**
 * Consistent random color names
 */
export const getColorName = (name: string) => {
  const stringUniqueHash = Array.from(name).reduce(
    (acc, char) =>
      char.charCodeAt(0) + ((acc << 5) - acc),
    0,
  );

  return `hsl(${stringUniqueHash % 360}, 95%, 20%)`;
};