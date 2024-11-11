import prettier from "prettier";

export const formatCode = async (
  code: string,
  parser: string,
  options?: prettier.Options
) => {
  const output = await prettier.format(code, {
    parser,
    tabWidth: 2, // Set indentation to 2 spaces
    useTabs: false, // Use spaces for indentation
    singleQuote: true, // Use single quotes
    semi: true, // Include semicolons
    ...options,
  });
  return output;
};
