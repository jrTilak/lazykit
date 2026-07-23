/** Removes the smallest shared indentation from non-empty lines. */
export const stripIndent = (value: string): string => {
  const normalized = value.replace(/\r\n?/g, "\n").replace(/^\n/, "").replace(/\n[\t ]*$/, "");
  const lines = normalized.split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^[\t ]*/)?.[0].length ?? 0);
  const minimum = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(Math.min(minimum, line.length))).join("\n");
};
