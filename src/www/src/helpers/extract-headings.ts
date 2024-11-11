export type Heading = {
  label: string;
  children: Heading[];
};

export const extractHeadings = (
  mdxContent: string,
  headingLevels: number[]
): Heading[] => {
  // Regex pattern to match headings (e.g., "# Heading", "## Subheading")
  const headingRegex = /^(\s*)(#{1,6})(\s*)(.+)$/gm;

  const contents: Heading[] = [];
  const stack: { level: number; content: Heading }[] = [];

  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(mdxContent)) !== null) {
    const [, , hashes, , headingText] = match;
    const level = hashes.length;

    // Skip headings that are not in the specified levels
    if (!headingLevels.includes(level)) {
      continue;
    }

    const content: Heading = { label: headingText.trim(), children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      contents.push(content);
    } else {
      stack[stack.length - 1].content.children.push(content);
    }

    stack.push({ level, content });
  }

  return contents;
};
