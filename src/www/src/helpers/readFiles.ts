import * as fs from "fs";
import * as path from "path";

/**
 * Reads all files from the specified directory.
 * @param dir - The directory path.
 * @returns An array of file names in the directory.
 */
export const readFiles = (dir: string) => {
  const filesAndFolders = fs.readdirSync(dir);
  // Filter out only files
  return filesAndFolders.filter((fileOrFolder: any) => {
    const fullPath = path.join(dir, fileOrFolder);
    return fs.statSync(fullPath).isFile();
  });
};

/**
 * Reads a file and returns its content as a string.
 * @param filePath - The path to the file.
 * @returns The content of the file as a string.
 */
export const readFileAsString = (filePath: string) => {
  return fs.readFileSync(filePath, "utf-8");
};
