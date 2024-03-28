import chalk from "chalk";
import checkInitialization from "../utils/checkInitialization.js";
import * as fs from "fs";
export default function teardown(...args: any) {
  const arg = args[0];
  const config = checkInitialization();

  /**
   * Check if the project is initialized or not.
   * If the project is not initialized, then exit the process.
   */
  if (!config.isInitialized) {
    console.log(chalk.red("Project is not initialized"));
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
  console.log(chalk.green("Project teardown successful! 🚀"));

  /**
   * Delete the directory where all the methods are stored, if the user has provided the --delete flag.
   */
  if (arg.delete) {
    console.log(
      chalk.red("Deleting the directory where all the methods are stored")
    );
    try {
      const pathToMethods = config.config.path.startsWith("/")
        ? config.config.path.slice(1)
        : config.config.path;
      fs.rmSync(`${process.cwd()}/${pathToMethods}`, { recursive: true });
    } catch (e) {
      console.log(chalk.red("Error deleting the directory"));
      process.exit(1);
    }
    console.log(chalk.green("Directory deleted successfully"));
  }
}
