import chalk from "chalk";
import checkInitialization from "../utils/checkInitialization.js";
import * as fs from "fs";
import inquirer from "inquirer";
import { REGISTRY_URL } from "../data/constant.js";
import exitProcess from "../utils/exitProcess.js";
import path from "path";
import cliSpinners from "cli-spinners";
import { camelCase, kebabCase } from "change-case";

export default async function add(...args: any[]) {
  const method = args[0];
  const arg = args[1];
  let pathToInstall = "";

  /**
   * Check if the project is initialized or not.
   * If the project is not initialized, then exit the process.
   */
  const config = checkInitialization();
  if (!config.isPackageJsonFound) {
    console.log(chalk.red("\npackage.json not found\n"));
    console.log(chalk.dim("Run `npm init -y` to create a package.json file."));
    exitProcess(1);
  }

  if (!config.isInitialized) {
    console.log(chalk.red("\nProject is not initialized\n"));

    console.log(
      chalk.dim("Run `npx @jrtilak/lazykit init` to init the project")
    );
    exitProcess(1);
  }

  /**
   * Override the path to install the method if the user has provided the path flag.
   */
  if (arg.path) {
    pathToInstall = arg.path;
  }

  /**
   * Get the language of the project.
   * If the user has provided the language flag, then use the provided language.
   * If the user has not provided the language flag, then use the language of the project configuration.
   */
  const getLang = async () => {
    if (arg.javascript) return "javascript";
    if (arg.typescript) return "typescript";
    if (!config.isInitialized) {
      const ans = await inquirer.prompt([
        {
          type: "list",
          name: "language",
          message: "Confirm the language: ",
          choices: [
            { name: "Typescript", value: "typescript" },
            { name: "Javascript", value: "javascript" },
          ],
          default: "javascript",
        },
      ]);
      return ans.language;
    }
    return config?.config?.language === "typescript"
      ? "typescript"
      : "javascript";
  };
  const lang = await getLang();

  /**
   * URL is the URL of the website where the registry is hosted.
   */

  //show spinner

  const spinner = cliSpinners.dots;
  let i = 0;

  const interval = setInterval(() => {
    i = ++i % spinner.frames.length;
    process.stdout.write(
      chalk.dim(spinner.frames[i]) + " Downloading method...\r"
    );
  }, spinner.interval);
  const res = await fetch(
    `${REGISTRY_URL}/api/methods?name=${method.join(",")}&lang=${lang}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = (await res.json())?.data ?? [];

  clearInterval(interval);

  if (res.status === 200) {
    // show spinner
    const spinner = cliSpinners.dots;
    let i = 0;

    const interval = setInterval(() => {
      i = ++i % spinner.frames.length;
      console.log(chalk.dim(spinner.frames[i]) + " Adding method...");
    }, spinner.interval);

    try {
      /**
       * Write the method to the file.
       * The method is written to the file in the path provided in the project configuration.
       */

      data?.forEach((method) => {
        const { name, code, type } = method;
        let filename = name;
        if (type === "react-hooks") {
          filename =
            config.config.filenameConvention?.reactHooks === "camelCase"
              ? camelCase(name)
              : kebabCase(name);
        } else {
          filename =
            config.config.filenameConvention?.helperFunctions === "camelCase"
              ? camelCase(name)
              : kebabCase(name);
        }

        pathToInstall = pathToInstall
          ? pathToInstall
          : type === "react-hooks"
            ? config.config.paths.reactHooks
            : config.config.paths.helperFunctions;

        const file = `${pathToInstall}/${filename}.${lang === "typescript" ? "ts" : "js"}`;
        const currentDir = process.cwd();

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(`${currentDir}/${file}`), {
          recursive: true,
        });

        fs.writeFileSync(`${currentDir}/${file}`, code);
      });

      console.log(chalk.green(`Method ${method} added successfully! 🚀`));
    } catch (e) {
      console.log(chalk.red(`\nError adding method ${method} 😞`));
    } finally {
      clearInterval(interval);
    }
  } else {
    console.log(chalk.red(`\nError adding method ${method} 😞`));
    console.log(chalk.dim("Status: " + res.status));
    console.log(chalk.dim("Message: " + data.message));
    exitProcess(1);
  }
}
