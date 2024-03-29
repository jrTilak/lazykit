import chalk from "chalk";
import checkInitialization from "../utils/checkInitialization.js";
import * as fs from "fs";
import packageJson from "../../package.json";
import inquirer from "inquirer";
import { REGISTRY_URL } from "../data/constant.js";

export default async function add(...args: any[]) {
  const method = args[0];
  const arg = args[1];
  let pathToInstall: string;

  /**
   * Check if the project is initialized or not.
   * If the project is not initialized, then exit the process.
   */
  const config = checkInitialization();
  if (!config.isInitialized) {
    console.log(chalk.red("\nProject is not initialized\n"));

    /**
     * Ask the user for path to install the method using inquirer.
     */
    if (arg.path) {
      pathToInstall = arg.path;
    } else {
      const ans = await inquirer.prompt([
        {
          type: "input",
          name: "path",
          message: "Enter the path to install the method",
          default: "src/utils",
        },
      ]);
      pathToInstall = ans.path;
    }
  } else {
    pathToInstall = config.config.path;
  }

  /**
   * Get the language of the project.
   * If the user has provided the language flag, then use the provided language.
   * If the user has not provided the language flag, then use the language of the project configuration.
   */
  const lang = (() => {
    if (arg.javascript) return "js";
    if (arg.typescript) return "ts";
    return config.config.language === "ts" ? "ts" : "js";
  })();

  /**
   * URL is the URL of the website where the registry is hosted.
   */

  const res = await fetch(`${REGISTRY_URL}/api/${method}?lang=${lang}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (res.status === 200) {
    try {
      /**
       * Write the method to the file.
       * The method is written to the file in the path provided in the project configuration.
       */
      const { name, code } = data;
      const file = `${pathToInstall}/${name}.${lang}`;
      const currentDir = process.cwd();
      fs.writeFileSync(`${currentDir}/${file}`, code);

      console.log(chalk.green(`Method ${method} added successfully! 🚀`));
    } catch (e) {
      console.log(chalk.red(`\nError adding method ${method} 😞`));
    }
  } else {
    console.log(chalk.red(`\nError adding method ${method} 😞`));
    console.log(chalk.dim("Status: " + res.status));
    console.log(chalk.dim("Message: " + data.message));
    console.log("\n");
    console.log(chalk.dim(packageJson.name + " v" + packageJson.version));
  }
}
