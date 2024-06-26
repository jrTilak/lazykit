#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import init from "./scripts/init.js";
import teardown from "./scripts/teardown.js";
import add from "./scripts/add.js";
import dotenv from "dotenv";
import { GITHUB_URL, REGISTRY_URL } from "./data/constant.js";
import exitProcess from "./utils/exitProcess.js";

//todo: The idea of using dotenv is to add some key while fetching the code so that the code api will be only accessible by CLI
dotenv.config();

/**
 * Main CLI program
 */
const program = new Command();
program
  .name("@jrtilak/lazykit")
  .description(
    "CLI program for adding utility methods to your the project for lazykit like a pro"
  );

/**
 * Handle when the program is run without any arguments
 * If there are no arguments, show a link to docs and github repo
 * Also show the version of the program
 * Also show run --help to get help
 */

if (process.argv.length === 2) {
  console.log(chalk.green("\nWelcome to Lazykit CLI 🚀"));
  console.log("For help, run: ", chalk.blue("--help"));
  console.log(
    "For documentation, visit: ",
    chalk.green(REGISTRY_URL + "/docs/introduction")
  );
  console.log("For github, visit: ", chalk.green(GITHUB_URL));
  exitProcess(0);
}

/**
 * Command to initialize the project
 */
program
  .command("init")
  .description("Initialize the project")
  .option("-js, --javascript", "Initialize the project with javascript")
  .option("-ts, --typescript", "Initialize the project with typescript")
  .option(
    "-p <path>, --path <path>",
    "Initialize the project in the given path"
  )
  .option(
    "-f, --force",
    "Force initialize the project, even if the project is already initialized"
  )
  .option(
    "-s, --separate",
    "Initialize the project configuration in separate file called lazykit.config.js else in package.json"
  )
  .action(init);

/**
 * Command to teardown the project
 */
program
  .command("teardown")
  .description("Remove the lazykit configuration from the project")
  .alias("td")
  .action(teardown);

program
  .command("add <method>")
  .description("Add a new method to the project")
  .option("-p, --path <path>", "Add the method in the given path")
  .option("-ts, --typescript", "Add the method in typescript")
  .option("-js, --javascript", "Add the method in javascript")
  .action(add);

program.parse(process.argv);
