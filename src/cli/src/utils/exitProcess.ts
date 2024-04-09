import chalk from "chalk";
import packageJson from "../../package.json";

/**
 * Prints the package name and version to the console.
 * Exits the process with a status code as the argument.
 */
export default function exitProcess(statusCode: number) {
  console.log("\n" + chalk.dim(packageJson.name + " v" + packageJson.version));
  process.exit(statusCode);
}
