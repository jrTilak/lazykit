export const extractImports = (code: string) => {
  // Regex to match import statements
  const importRegex = /import\s+([\w*{},\s]+)\s+from\s+['"]([^'"]+)['"];?/g;

  let imports: string[] = [];
  let cleanedCode = code.replace(importRegex, (_, imported: string) => {
    // Split the imported items by commas and trim any whitespace
    const importedItems = imported.split(",").map((item) => item.trim());

    // Filter out the actual names (not using destructuring or wildcard imports)
    const filteredImports = importedItems.filter(
      (item) => item && !item.includes("*")
    );

    // Add the filtered imports to the imports array
    imports.push(...filteredImports);

    // Return an empty string to remove the import statement from the code
    return "";
  });

  return {
    cleanedCode,
    imports,
  };
};
