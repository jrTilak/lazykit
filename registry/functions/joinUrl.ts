/** Joins URL or path segments without damaging the protocol or query string. */
export const joinUrl = (base: string, ...segments: string[]): string => {
  if (segments.length === 0) return base;
  const match = base.match(/^([^?#]*)([?#].*)?$/);
  const basePath = match?.[1] ?? base;
  const suffix = match?.[2] ?? "";
  const protocol = basePath.match(/^[a-z][a-z\d+.-]*:\/\//i)?.[0] ?? "";
  const rest = basePath.slice(protocol.length).replace(/\/+$/, "");
  const joined = [rest, ...segments]
    .map((segment, index) => index === 0 ? segment : segment.replace(/^\/+|\/+$/g, ""))
    .filter((segment, index) => index === 0 || segment.length > 0)
    .join("/");
  return protocol + joined + suffix;
};
