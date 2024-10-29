import prettier from "prettier";

export const formatCode = async (code: string, parser: string) => {
  const options = {
    parser,
    tabWidth: 2, // Set indentation to 2 spaces
    useTabs: false, // Use spaces for indentation
    singleQuote: true, // Use single quotes
    semi: true, // Include semicolons
  };

  const output = await prettier.format(code, options);
  return output;
};
