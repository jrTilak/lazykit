type AvailableLanguages = "typescript" | "javascript";
type FilenameConvention = "camelCase" | "kebab-case";
export interface Config {
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
}
