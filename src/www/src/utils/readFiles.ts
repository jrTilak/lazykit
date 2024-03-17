import * as fs from "fs";
import * as path from "path";

export const readFiles = (dir: string) => {
  const filesAndFolders = fs.readdirSync(dir);
  // Filter out only files
  return filesAndFolders.filter((fileOrFolder: any) => {
    const fullPath = path.join(dir, fileOrFolder);
    return fs.statSync(fullPath).isFile();
  });
};

export const readFileAsString = (filePath: string) => {
  return fs.readFileSync(filePath, "utf-8");
};
