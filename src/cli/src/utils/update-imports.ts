import { Config } from "../types/config.types.js";

export const updateImports = (code: string, config: Config): string => {
  // Regular expression to match both named and default import statements
  const regex =
    /import\s*(?:{([^}]+)}|([^\s]+))\s*from\s*['"]@\/registry\/([^/]+)\/([^/]+)\/([^'"]+)['"]/g;

  // Get all matches in an array of arrays with match groups
  const matches = [...code.matchAll(regex)];

  // If no matches, return original code
  if (matches.length === 0) {
    return code;
  }

  let newCode = code;

  // Process each match to update the import paths
  matches.forEach((match) => {
    // Destructure the matched groups
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, importNames, defaultImport, type, category, name] = match;

    // Use either named import or default import
    const importName = importNames || defaultImport;

    // Determine the path based on the type
    const pathToInstall =
      type === "react-hooks"
        ? config.paths.reactHooks
        : type === "functions"
          ? config.paths.helperFunctions
          : "";

    // Replace the old import with the new import path
    newCode = newCode.replace(
      match[0], // match[0] contains the entire matched string
      `import ${importNames ? `{${importName}}` : importName} from "${pathToInstall}/${name}";`
    );
  });

  // Return the updated code
  return newCode;
};
