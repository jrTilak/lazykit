import * as fs from "fs";
import { Config } from "../types/config.types.js";

export default function checkInitialization() {
  let isInitialized = false;
  let config: Config = null;
  let isPackageJsonFound = false;

  try {
    const packageJson = fs.readFileSync(
      `${process.cwd()}/package.json`,
      "utf-8"
    );
    const packageJsonObj = JSON.parse(packageJson);
    if (packageJsonObj.lazykit) {
      isInitialized = true;
      config = packageJsonObj.lazykit;
    }
    isPackageJsonFound = true;
  } catch (e) {
    isPackageJsonFound = false;
  }

  if (!isInitialized) {
    try {
      const lazykitConfig = fs.readFileSync(
        `${process.cwd()}/lazykit.config.json`,
        "utf-8"
      );
      const lazykitConfigObj = JSON.parse(lazykitConfig);
      if (lazykitConfigObj) {
        isInitialized = true;
        config = lazykitConfigObj;
      }
    } catch (e) {
      // Handle error reading lazykit.config.json
    }
  }

  return { isInitialized, config, isPackageJsonFound };
}
