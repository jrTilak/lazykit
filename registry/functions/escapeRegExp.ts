/** Escapes text so it can be safely embedded in a regular expression. */
export const escapeRegExp = (value: string): string => {
  return value.replace(/[\\^$.*+?()[\]{}|/-]/g, "\\$&");
};
