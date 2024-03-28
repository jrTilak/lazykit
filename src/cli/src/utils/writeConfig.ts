import chalk from "chalk";
import * as fs from "fs";
import { Config } from "../types/config.types.js";

export default function writeConfig(config: Config) {
  if (config.separate) {
    console.log(chalk.green("Writing config to separate file"));
    fs.writeFileSync(
      `${process.cwd()}/lazykit.config.json`,
      JSON.stringify(config, null, 2)
    );
  } else {
    console.log(chalk.green("Writing config to package.json"));
    let packageJson = fs.readFileSync(`${process.cwd()}/package.json`, "utf-8");
    let packageJsonObj = JSON.parse(packageJson);
    fs.writeFileSync(
      `${process.cwd()}/package.json`,
      JSON.stringify(
        {
          ...packageJsonObj,
          lazykit: config,
        },
        null,
        2
      )
    );
  }
}
