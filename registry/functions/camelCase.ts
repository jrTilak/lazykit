const words = (value: string): string[] => {
  return value
    .replace(/([\p{Ll}\d])(\p{Lu}(?=\p{Ll}))/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .match(/[\p{L}\p{N}]+/gu) ?? [];
};

/** Converts text from common word boundaries into camel case. */
export const camelCase = (value: string): string => {
  return words(value)
    .map((word, index) => {
      const lower = word.toLocaleLowerCase();
      return index === 0 ? lower : lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
    })
    .join("");
};
