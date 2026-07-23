/** Truncates text to a maximum length, including its omission marker. */
export const truncate = (
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
  return characters.slice(0, maxLength - marker.length).join("") + omission;
};
