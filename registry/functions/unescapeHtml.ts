const entities: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&amp;": "&",
};

/** Decodes the HTML entities produced by escapeHtml. */
export const unescapeHtml = (value: string): string => {
  return value.replace(/&(lt|gt|quot|#39|#x27|amp);/gi, (entity) => entities[entity.toLocaleLowerCase()] ?? entity);
};
