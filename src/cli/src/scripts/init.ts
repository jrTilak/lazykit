import chalk from "chalk";
import * as fs from "fs";
import writeConfig from "../utils/writeConfig.js";
import { Config } from "../types/config.types.js";
import checkInitialization from "../utils/checkInitialization.js";

/**
 * Initializes the project with the provided configuration.
 * @param args - The command line arguments passed to the script.
 */
export default function init(...args: any) {
  /**
   * Get the arguments passed to the script from the command line.
   */
  const arg = args[0];

  const DEFAULT_CONFIG: Config = {
    language: "ts",
    path: arg.path || "src/utils",
    separate: arg.separate || false,
  };

  /**
   * Check if the project is already initialized, if yes, then exit the process.
   * If the user has provided the --force flag, then force initialize the project.
   * If the user has not provided the --force flag, then exit the process.
   */
  if (!arg.force) {
    if (checkInitialization().isInitialized) {
      console.log(
        chalk.red(
          "Project already initialized, use --force to force initialize the project"
        )
      );
      process.exit(1);
    }
  }

  /**
   * If the user has not provided any language flag, then detect the language of the project.
   * If the user has provided the language flag, then use the provided language.
   */
  if (!arg.javascript && !arg.commonjs && !arg.typescript) {
    console.log(chalk.dim("Detecting the language of the project"));

    /**
     * Get the current working directory of the project.
     */
    const path = process.cwd();
    let packageJson = undefined;
    try {
      /**
       * Read the package.json file of the project.
       * If the package.json file does not exist, then exit the process.
       */
      packageJson = fs.readFileSync(`${path}/package.json`, "utf-8");
    } catch (e) {
      /**
       * todo if the package.json file does not exist, search in parent folders, give priority to the nearest package.json file in the parent folder and do the operation there
       */
      if (!packageJson) {
        console.log(chalk.red("No package.json file found"));
        process.exit(1);
      }
    }

    /**
     * Parse the package.json file to a JSON object.
     * If the package.json file is invalid, then exit the process.
     */
    let packageJsonObj = undefined;
    try {
      packageJsonObj = JSON.parse(packageJson);
    } catch (e) {
      console.log(chalk.red("Invalid package.json file"));
      process.exit(1);
    }

    /**
     * Check if the project is a typescript project or a javascript project.
     * If the project is a typescript project, then set the typescript flag to true or set the javascript flag to true.
     */
    if (
      packageJsonObj.devDependencies.typescript ||
      packageJsonObj.dependencies.typescript
    ) {
      console.log(chalk.dim("Detected typescript project"));
      arg.typescript = true;
    } else {
      console.log(
        chalk.dim("No typescript project detected, Using javascript")
      );
      arg.javascript = true;
    }
  }

  /**
   * Initialize the project with the provided configuration.
   */
  console.log(
    chalk.green("Initializing the project with the following config: 👇")
  );
  if (arg.typescript) {
    writeConfig(DEFAULT_CONFIG);
  } else {
    DEFAULT_CONFIG.language = "js";
    writeConfig(DEFAULT_CONFIG);
  }
  console.log(chalk.dim(JSON.stringify(DEFAULT_CONFIG, null, 2)));
  console.log(chalk.green("Project initialized successfully ⭐"));
  console.log("Enjoy using lazykit 🚀");
  process.exit(0);
}
