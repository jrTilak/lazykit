import chalk from "chalk";
import checkInitialization from "../utils/checkInitialization.js";
import * as fs from "fs";
export default async function add(...args: any[]) {
  const method = args[0];
  const arg = args[1];
  const config = checkInitialization();
  const lang = (() => {
    if (arg.javascript) return "js";
    if (arg.typescript) return "ts";
    return config.config.language === "ts" ? "ts" : "js";
  })();
  if (!config.isInitialized) {
    console.log(chalk.red("Project is not initialized"));
    process.exit(1);
  } else {
    const url = process.env.WEBSITE_URL;
    const token = process.env.WEBSITE_TOKEN;
    const res = await fetch(`${url}/api/${method}?lang=${lang}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // TOKEN: token,
      },
    });
    console.log(`${url}/api/${method}`);
    const data = await res.json();
    if (res.status === 200) {
      const { name, code } = data;
      const path = config.config.path;
      const file = `${path}/${name}.${lang}`;
      const currentDir = process.cwd();
      fs.writeFileSync(`${currentDir}/${file}`, code);

      console.log(chalk.green(`Method ${method} added successfully! 🚀`));
    } else {
      console.log(chalk.red(`Error adding method ${method} 😞`));
      console.log(chalk.dim("Error: ", JSON.stringify(data, null, 2)));
    }
  }
}
