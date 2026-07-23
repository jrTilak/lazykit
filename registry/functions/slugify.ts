/** Converts text into a lowercase, URL-safe Unicode slug. */
export const slugify = (value: string, separator: string = "-"): string => {
  if (!/^[-._~]+$/.test(separator)) {
    throw new TypeError(
      "separator must contain only URL-safe punctuation characters: -._~"
    );
  }

  const normalized = value
    .normalize("NFKD")
    .replace(/(?<=\p{Script=Latin})\p{M}+/gu, "")
    .toLowerCase();
  const words =
    normalized.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*/gu) ?? [];
  return words.join(separator);
};
