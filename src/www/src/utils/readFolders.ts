import * as fs from "fs";
import * as path from "path";

/**
 * Reads the folders in the specified directory.
 * 
 * @param dir - The directory path.
 * @returns An array of folder names in the directory.
 */
export const readFolders = (dir: string) => {
  const filesAndFolders = fs.readdirSync(dir);
  // Filter out only directories
  return filesAndFolders.filter((fileOrFolder: any) => {
    const fullPath = path.join(dir, fileOrFolder);
    return fs.statSync(fullPath).isDirectory();
  });
};
