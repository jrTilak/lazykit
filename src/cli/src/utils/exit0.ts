import chalk from "chalk";
import packageJson from "../../package.json";

/**
 * Prints the package name and version to the console.
 * Exits the process with a status code of 0.
 */
export default function exit0() {
  console.log("\n" + chalk.dim(packageJson.name + " v" + packageJson.version));
  process.exit(0);
}
