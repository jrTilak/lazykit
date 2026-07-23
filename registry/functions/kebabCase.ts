const words = (value: string): string[] => {
  return value
    .replace(/([\p{Ll}\d])(\p{Lu}(?=\p{Ll}))/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .match(/[\p{L}\p{N}]+/gu) ?? [];
};

/** Converts text from common word boundaries into lowercase kebab case. */
export const kebabCase = (value: string): string => {
  return words(value).map((word) => word.toLocaleLowerCase()).join("-");
};
