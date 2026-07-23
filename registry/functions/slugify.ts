/** Converts text into a lowercase, URL-safe Unicode slug. */
export const slugify = (value: string, separator: string = "-"): string => {
  if (separator.length === 0 || /[\p{L}\p{N}]/u.test(separator)) {
    throw new TypeError("separator must contain only non-alphanumeric characters");
  }
  const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value
    .normalize("NFKD")
    .replace(/(?<=[A-Za-z])\p{M}+/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, separator)
    .replace(new RegExp(`^(?:${escaped})+|(?:${escaped})+$`, "g"), "");
};
