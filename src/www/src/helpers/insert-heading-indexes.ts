export const insertHeadingIndexes = (
  mdxContent: string,
  headingLevels: number[] = [1, 2, 3, 4, 5, 6]
) => {
  // Regex pattern to match headings (e.g., "# Heading", "## Subheading")
  const headingRegex = /^(\s*)(#{1,6})(\s*)(?!\d+\.\s)(.+)$/gm;

  // Create a map to keep track of counters for each heading level
  const headingCounters: Record<number, number> = {};

  // Replace function to update headings with index numbers
  const updatedContent = mdxContent.replace(
    headingRegex,
    (
      match: string,
      spaces: string,
      hashes: string,
      spaceAfterHashes: string,
      headingText: string
    ): string => {
      // Determine the heading level based on the number of '#' symbols
      const headingLevel: number = hashes.length;

      // If this heading level is not in the specified levels, ignore it
      if (!headingLevels.includes(headingLevel)) return match;

      // Initialize counters for each heading level up to 6
      for (let level = 1; level <= 6; level++) {
        if (headingCounters[level] === undefined) headingCounters[level] = 0;
      }

      // Increment the counter for the current heading level
      headingCounters[headingLevel] += 1;

      // Reset all lower-level counters whenever a higher-level heading is encountered
      for (let level = headingLevel + 1; level <= 6; level++) {
        headingCounters[level] = 0;
      }

      // Create the heading index as `1.` or `2.` based on the current counter for this level
      const headingIndex = /^\s*\d\.\s+/.test(headingText)
        ? ""
        : `${headingCounters[headingLevel]}.`;

      // Construct the new heading with the index number included, e.g., "1. Heading Text"
      const indexedHeading = `${spaces}${hashes}${spaceAfterHashes}${headingIndex} ${headingText}`;

      return indexedHeading;
    }
  );

  return updatedContent;
};
