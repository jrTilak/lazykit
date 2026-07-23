type QueryValue = string | number | boolean | null | undefined | readonly (string | number | boolean)[];

/** Adds, replaces, or removes query parameters while preserving relative URLs and hashes. */
export const withQueryParams = (
  input: string | URL,
  params: Readonly<Record<string, QueryValue>>
): string => {
  const original = String(input);
  const hashIndex = original.indexOf("#");
  const hash = hashIndex < 0 ? "" : original.slice(hashIndex);
  const beforeHash = hashIndex < 0 ? original : original.slice(0, hashIndex);
  const queryIndex = beforeHash.indexOf("?");
  const base = queryIndex < 0 ? beforeHash : beforeHash.slice(0, queryIndex);
  const searchParams = new URLSearchParams(queryIndex < 0 ? "" : beforeHash.slice(queryIndex + 1));
  for (const [key, value] of Object.entries(params)) {
    searchParams.delete(key);
    if (value == null) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) searchParams.append(key, String(item));
  }
  const query = searchParams.toString();
  return `${base}${query ? `?${query}` : ""}${hash}`;
};
