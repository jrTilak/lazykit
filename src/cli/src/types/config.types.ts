type AvailableLanguages = "typescript" | "javascript";
type FilenameConvention = "camelCase" | "kebab-case";
export interface Config {
  $schema: string;
  v: string;
  language: AvailableLanguages;
  separate: boolean;
  paths: {
    helperFunctions: string;
    reactHooks: string;
  };
  filenameConvention: {
    helperFunctions: FilenameConvention;
    reactHooks: FilenameConvention;
  };
  resolve?: {
    alias?: {
      [key: string]: string;
    };
  };
}
