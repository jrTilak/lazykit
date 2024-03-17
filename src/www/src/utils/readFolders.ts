import * as fs from "fs";
import * as path from "path";

export const readFolders = (dir: string) => {
  const filesAndFolders = fs.readdirSync(dir);
  // Filter out only directories
  return filesAndFolders.filter((fileOrFolder: any) => {
    const fullPath = path.join(dir, fileOrFolder);
    return fs.statSync(fullPath).isDirectory();
  });
};
