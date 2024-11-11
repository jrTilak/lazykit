import chalk from "chalk";
import * as fs from "fs";
import inquirer from "inquirer";
import writeConfig from "../utils/writeConfig.js";
import { Config } from "../types/config.types.js";
import checkInitialization from "../utils/checkInitialization.js";
import packageJson from "../../package.json";
import exitProcess from "../utils/exitProcess.js";
import { SCHEMA_URL } from "../data/constant.js";

/**../utils/exit.js
 * Initializes the project with the provided configuration.
 * @param args - The command line arguments passed to the script.
 */
export default async function init(...args: any) {
  /**
   * Get the arguments passed to the script from the command line.
   */
  const arg = args[0];

  const DEFAULT_CONFIG: Config = {
    $schema: SCHEMA_URL,
    language: "typescript",
    separate: false,
    v: packageJson.version,
    filenameConvention: {
      helperFunctions: "kebab-case",
      reactHooks: "kebab-case",
    },
    paths: {
      helperFunctions: "/src/helpers",
      reactHooks: "/src/hooks",
    },
    resolve: {
      alias: {},
    },
  };

  /**
   * Check if the project is already initialized, if yes, then exit the process.
   * If the user has provided the --force flag, then force initialize the project.
   * If the user has not provided the --force flag, then exit the process.
   */
  if (!arg.force) {
    if (checkInitialization().isInitialized) {
      console.log(chalk.red("\n!! WARNING !!"));
      console.log("Project is already initialized 🚫");
      console.log(
        "If you want to reinitialize the project, use --force or -f flag"
      );
      exitProcess(1);
    }
  }

  if (!arg.yes) {
    /**
     * detect the language of the project.
     */
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
      if (!packageJson) {
        console.log(chalk.red("No package.json file found 💀"));
        console.log(
          chalk.dim(
            "Please run the command in the root of the project or initialize a project before running the command\n"
          )
        );
        exitProcess(1);
      }

      /**
       * Parse the package.json file to a JSON object.
       * If the package.json file is invalid, then exit the process.
       */
      let packageJsonObj = undefined;
      try {
        packageJsonObj = JSON.parse(packageJson);
      } catch (e) {
        console.log(chalk.red("\nInvalid package.json file 💀"));
        console.log(
          chalk.dim(
            "Please make sure that the package.json file is a valid JSON file\n"
          )
        );
        exitProcess(1);
      }

      /**
       * Check if the project is a typescript project or a javascript project.
       * If the project is a typescript project, then set the typescript flag to true or set the javascript flag to true.
       */
      if (
        packageJsonObj?.devDependencies?.typescript ||
        packageJsonObj?.dependencies?.typescript
      ) {
        DEFAULT_CONFIG.language = "typescript";
      } else {
        DEFAULT_CONFIG.language = "javascript";
      }
      /**
       *  Configure the project with the detected language with user using inquirer
       */
      const ans = await inquirer.prompt([
        {
          type: "list",
          name: "language",
          message: "Confirm the language for the project: ",
          choices: [
            { name: "Typescript", value: "typescript" },
            { name: "Javascript", value: "javascript" },
          ],
          default: DEFAULT_CONFIG.language,
        },
      ]);
      DEFAULT_CONFIG.language = ans.language;
    }

    /**
     *  ask the user for the path.
     */
    {
      const ans = await inquirer.prompt([
        {
          type: "input",
          name: "path",
          message: "Enter the path to store the helper functions: ",
          default: DEFAULT_CONFIG.paths.helperFunctions,
          validate: (input: string) => {
            // The path should start with ./, /, or any alias symbol (like @, $, ~), but not directly with a file name (i.e., no trailing file extension at the start)
            const aliasPattern = /^[/./@~$]/; // Allows /, ./, @, ~, $
            const isValidPath =
              aliasPattern.test(input) && !input.match(/\/[^/]*\.[^/]*$/);

            if (isValidPath) {
              return true;
            }
            return "Enter a valid path starting with ./, /, @, $, ~ or any other alias symbol";
          },
        },
      ]);

      DEFAULT_CONFIG.paths.helperFunctions = ans.path;
    }

    {
      const ans = await inquirer.prompt([
        {
          type: "input",
          name: "path",
          message: "Enter the path to store the react-hooks: ",
          default: DEFAULT_CONFIG.paths.reactHooks,
          validate: (input: string) => {
            // The path should start with /, or any alias symbol (like @, $, ~), but not directly with a file name (i.e., no trailing file extension at the start)
            const aliasPattern = /^[/@~$]/; // Allows /, @, ~, $
            const isValidPath =
              aliasPattern.test(input) && !input.match(/\/[^/]*\.[^/]*$/);

            if (isValidPath) {
              return true;
            }
            return "Enter a valid path starting with /, @, $, ~ or any other alias symbol";
          },
        },
      ]);

      DEFAULT_CONFIG.paths.reactHooks = ans.path;
    }

    /**
     * if the path for helper functions and react hooks starts with other than ./ or /, then ask the user for the alias.
     */
    if (DEFAULT_CONFIG.paths.helperFunctions[0] !== "/") {
      const ans = await inquirer.prompt([
        {
          type: "input",
          name: "alias",
          message: `Enter the path for the alias ${DEFAULT_CONFIG.paths.helperFunctions}: `,
          validate: (input: string) => {
            const aliasPattern = /^[/]/; // Allows /,
            const isValidAlias = aliasPattern.test(input);

            if (isValidAlias) {
              return true;
            }
            return "Enter a valid alias starting with @, $, ~";
          },
        },
      ]);
      DEFAULT_CONFIG.resolve.alias[DEFAULT_CONFIG.paths.helperFunctions] =
        ans.alias;
    }

    if (
      DEFAULT_CONFIG.paths.reactHooks[0] !== "." &&
      DEFAULT_CONFIG.paths.reactHooks[0] !== "/"
    ) {
      const ans = await inquirer.prompt([
        {
          type: "input",
          name: "alias",
          message: `Enter the path for the alias ${DEFAULT_CONFIG.paths.reactHooks}: `,
          validate: (input: string) => {
            // The alias should start with ./, /
            const aliasPattern = /^[/./]/; // Allows /, ./
            const isValidAlias = aliasPattern.test(input);

            if (isValidAlias) {
              return true;
            }
            return "Enter a valid alias starting with @, $, ~";
          },
        },
      ]);
      DEFAULT_CONFIG.resolve.alias[DEFAULT_CONFIG.paths.reactHooks] = ans.alias;
    }

    /**
     *  ask the user for the fileNameConvention.
     */
    {
      const ans = await inquirer.prompt([
        {
          type: "list",
          name: "path",
          message: "Enter the filename convention for helper functions: ",
          default: DEFAULT_CONFIG.filenameConvention.helperFunctions,
          choices: [
            {
              value: "camelCase",
              name: "camelCase",
            },
            {
              value: "kebabCase",
              name: "kebab-case",
            },
          ],
        },
      ]);

      DEFAULT_CONFIG.filenameConvention.helperFunctions = ans.path;
    }

    {
      const ans = await inquirer.prompt([
        {
          type: "list",
          name: "path",
          message: "Enter the filename convention for react hooks: ",
          default: DEFAULT_CONFIG.filenameConvention.reactHooks,
          choices: [
            {
              value: "camelCase",
              name: "camelCase",
            },
            {
              value: "kebabCase",
              name: "kebab-case",
            },
          ],
        },
      ]);

      DEFAULT_CONFIG.filenameConvention.reactHooks = ans.path;
    }

    /**
     * ask the user for the separate flag.
     */
    if (!arg.separate) {
      const ans = await inquirer.prompt([
        {
          type: "confirm",
          name: "separate",
          message:
            "Do you want to store the configuration in a separate file? ",
          default: DEFAULT_CONFIG.separate,
        },
      ]);

      DEFAULT_CONFIG.separate = ans.separate;
    }
  }

  /**
   * Initialize the project with the provided configuration.
   */
  console.log(
    chalk.green("\nInitializing the project with the following config: 👇\n")
  );
  writeConfig(DEFAULT_CONFIG);
  console.log(chalk.dim(JSON.stringify(DEFAULT_CONFIG, null, 2)));
  console.log(chalk.green("\nProject initialized successfully ⭐"));
  console.log("Enjoy using lazykit 🚀\n");

  exitProcess(0);
}
