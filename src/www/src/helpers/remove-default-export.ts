export const removeDefaultExport = (code: string) => {
  // Regex to match default export statements
  const exportRegex = /export\s+default\s+([^;]+);?/g;

  // Replace default exports with an empty string
  const cleanedCode = code.replace(exportRegex, "");

  return cleanedCode;
};
