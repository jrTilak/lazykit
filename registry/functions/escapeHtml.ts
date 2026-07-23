const entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapes the five characters with special meaning in HTML text and attributes. */
export const escapeHtml = (value: string): string => {
  return value.replace(
    /[&<>"']/g,
    (character) => entities[character] ?? character
  );
};
