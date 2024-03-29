import chalk from "chalk";
import checkInitialization from "../utils/checkInitialization.js";
import packageJson from "../../package.json";
import * as fs from "fs";

/**
 * Tears down the project by deleting the configuration file and removing the lazykit configuration from package.json.
 * @param args - The arguments passed to the teardown function.
 */
export default function teardown(...args: any) {
  const arg = args[0];
  const config = checkInitialization();

  /**
   * Check if the project is initialized or not.
   * If the project is not initialized, then exit the process.
   */
  if (!config.isInitialized) {
    console.log(chalk.red("Project is not initialized 😐"));
    process.exit(1);
  }

  /**
   * Delete the configuration file of the project from the project.
   */
  if (config.config.separate) {
    try {
      fs.unlinkSync(`${process.cwd()}/lazykit.config.json`);
    } catch (e) {
      console.log(chalk.red("Error deleting the configuration file"));
      process.exit(1);
    }
  } else {
    try {
      const packageJson = fs.readFileSync(
        `${process.cwd()}/package.json`,
        "utf-8"
      );
      const packageJsonObj = JSON.parse(packageJson);
      delete packageJsonObj.lazykit;
      fs.writeFileSync(
        `${process.cwd()}/package.json`,
        JSON.stringify(packageJsonObj, null, 2)
      );
    } catch (e) {
      console.log(
        chalk.red("Error deleting the configuration from package.json")
      );
      process.exit(1);
    }
  }
  console.log(chalk.green("Project teardown successful! 🚀\n"));
  console.log(chalk.dim(packageJson.name + " v" + packageJson.version));
  process.exit(0);
}
