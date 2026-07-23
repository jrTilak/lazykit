const segmenter =
  typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : undefined;

const splitGraphemes = (value: string): string[] => {
  if (!segmenter) return Array.from(value);
  return Array.from(segmenter.segment(value), ({ segment }) => segment);
};

/** Truncates the middle of text by grapheme while preserving both ends. */
export const truncateMiddle = (
  value: string,
  maxLength: number,
  omission: string = "…"
): string => {
  if (!Number.isSafeInteger(maxLength) || maxLength < 0) {
    throw new RangeError("maxLength must be a non-negative safe integer");
  }

  const graphemes = splitGraphemes(value);
  if (graphemes.length <= maxLength) return value;

  const marker = splitGraphemes(omission);
  if (marker.length >= maxLength) return marker.slice(0, maxLength).join("");
  const available = maxLength - marker.length;
  const start = Math.ceil(available / 2);
  const end = Math.floor(available / 2);
  return (
    graphemes.slice(0, start).join("") +
    omission +
    graphemes.slice(graphemes.length - end).join("")
  );
};
