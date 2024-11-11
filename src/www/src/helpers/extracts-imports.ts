export const extractImports = (code: string): string[] => {
  const imports: string[] = [];
  // Regular expression to match both named and default import statements
  const regex =
    /import\s*(?:{([^}]+)}|([^\s]+))\s*from\s*['"]@\/registry\/([^/]+)\/([^/]+)\/([^'"]+)['"]/g;

  // Get all matches in an array of arrays with match groups
  const matches = [...code.matchAll(regex)];

  // If no matches, return original code
  if (matches.length === 0) {
    return [];
  }

  // Process each match to update the import paths
  matches.forEach((match) => {
    // Destructure the matched groups
    const [_, importNames, defaultImport, type, category, name] = match;

    imports.push(name);
  });

  // Return the updated code
  return imports;
};
