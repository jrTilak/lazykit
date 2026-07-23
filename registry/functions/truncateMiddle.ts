/** Truncates the middle of text while preserving both ends. */
export const truncateMiddle = (
  value: string,
  maxLength: number,
  omission: string = "…"
): string => {
  if (!Number.isSafeInteger(maxLength) || maxLength < 0) {
    throw new RangeError("maxLength must be a non-negative safe integer");
  }
  const characters = Array.from(value);
  if (characters.length <= maxLength) return value;
  const marker = Array.from(omission);
  if (marker.length >= maxLength) return marker.slice(0, maxLength).join("");
  const available = maxLength - marker.length;
  const start = Math.ceil(available / 2);
  const end = Math.floor(available / 2);
  return characters.slice(0, start).join("") + omission + characters.slice(characters.length - end).join("");
};
