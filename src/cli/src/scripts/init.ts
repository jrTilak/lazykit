import chalk from "chalk";
import * as fs from "fs";
import writeConfig from "../utils/writeConfig.js";
import { Config } from "../types/config.types.js";
import checkInitialization from "../utils/checkInitialization.js";

export default function init(...args: any) {
  const arg = args[0];

  const DEFAULT_CONFIG: Config = {
    language: "typescript",
    path: arg.path || "src/utils",
    separate: arg.separate || false,
  };
  //check if the project is already initialized
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
   * If the user has not provided any language, use the default language ie. typescript
   */
  if (!arg.javascript && !arg.commonjs && !arg.typescript) {
    //detect the language from the project
    console.log("Detecting the language of the project");
    //get the path of the project
    const path = process.cwd();
    let packageJson = undefined;
    try {
      //import the package.json file as string
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

    //convert the package.json file to json object
    let packageJsonObj = undefined;
    try {
      packageJsonObj = JSON.parse(packageJson);
    } catch (e) {
      console.log(chalk.red("Invalid package.json file"));
      process.exit(1);
    }

    //check if the project is a typescript project
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
   * Initialize the project with typescript
   */
  if (arg.typescript) {
    console.log(
      chalk.green("Initializing the project with the following config: 👇")
    );
    console.log(JSON.stringify(DEFAULT_CONFIG, null, 2));
    writeConfig(DEFAULT_CONFIG);
  } else if (arg.javascript) {
    DEFAULT_CONFIG.language = "javascript";
    console.log(
      chalk.green("Initializing the project with the following config: 👇")
    );
    console.log(JSON.stringify(DEFAULT_CONFIG, null, 2));
    writeConfig(DEFAULT_CONFIG);
  } else if (arg.commonjs) {
    DEFAULT_CONFIG.language = "commonjs";
    console.log(
      chalk.green("Initializing the project with the following config: 👇")
    );
    console.log(JSON.stringify(DEFAULT_CONFIG, null, 2));
    writeConfig(DEFAULT_CONFIG);
  }

  console.log(chalk.green("Project initialized successfully ⭐"));
  console.log("Enjoy using lazykit 🚀");
}
