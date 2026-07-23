const words = (value: string): string[] => {
  return value
    .replace(/([\p{Ll}\d])(\p{Lu}(?=\p{Ll}))/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .match(/[\p{L}\p{N}]+/gu) ?? [];
};

/** Converts text from common word boundaries into title case. */
export const titleCase = (value: string): string => {
  return words(value)
    .map((word) => {
      const lower = word.toLocaleLowerCase();
      return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
    })
    .join(" ");
};
