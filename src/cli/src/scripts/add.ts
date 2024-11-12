import chalk from "chalk";
import checkInitialization from "../utils/checkInitialization.js";
import * as fs from "fs";
import { REGISTRY_URL } from "../data/constant.js";
import exitProcess from "../utils/exitProcess.js";
import path from "path";
import cliSpinners from "cli-spinners";
import { camelCase, kebabCase } from "change-case";
import { updateImports } from "../utils/update-imports.js";

export default async function add(...args: any[]) {
  const methods = args[0];
  const arg = args[1];

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
   * Get the language of the project.
   */

  const lang =
    config?.config?.language === "typescript" ? "typescript" : "javascript";

  /**
   * URL is the URL of the website where the registry is hosted.
   */
  const spinner = cliSpinners.dots;
  let i = 0;

  const interval = setInterval(() => {
    i = ++i % spinner.frames.length;
    process.stdout.write(
      chalk.dim(spinner.frames[i]) +
        ` Downloading method ${methods.join(", ")}...\r`
    );
  }, spinner.interval);

  const res = await fetch(
    `${REGISTRY_URL}/api/methods?name=${methods.join(",")}&lang=${lang}`,
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
    data.map((method) => {
      const { name, code, type } = method;

      const refinedCode = `/**\n * Taken from @jrtilak/lazykit\n * See more about this method: ${method.url}\n */\n\n${updateImports(code, config.config)}`;

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

      let pathToInstall =
        type === "react-hooks"
          ? config.config.paths.reactHooks
          : config.config.paths.helperFunctions;

      if (!pathToInstall.startsWith(".") || !pathToInstall.startsWith("/")) {
        // Resolve the alias if exists
        pathToInstall =
          config.config.resolve?.alias?.[pathToInstall] ?? undefined;

        if (!pathToInstall) {
          console.log(
            chalk.red(`\nAlias ${pathToInstall} not found in the configuration`)
          );
          return;
        }
      }

      const file = `${pathToInstall}/${filename}.${lang === "typescript" ? "ts" : "js"}`;
      const currentDir = process.cwd();

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(`${currentDir}/${file}`), {
        recursive: true,
      });

      /**
       * If the file already exists, ask the user if they want to overwrite the file.
       */
      if (fs.existsSync(`${currentDir}/${file}`) && !arg.force) {
        console.log(
          chalk.red(
            `\nFile ${file} already exists, pass --force to overwrite the file`
          )
        );
      } else {
        fs.writeFileSync(`${currentDir}/${file}`, refinedCode);
        console.log(chalk.dim(`Method ${method.name} added successfully! 🚀`));
      }
    });
  } else {
    console.log(
      chalk.red(`\nError adding method ${JSON.stringify(methods)} 😞`)
    );
    console.log(chalk.dim("Status: " + res.status));
    console.log(chalk.dim("Message: " + data.message));
  }
}
