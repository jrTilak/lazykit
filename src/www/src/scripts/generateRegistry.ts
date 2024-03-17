import * as fs from "fs";
import { readFolders } from "../utils/readFolders";
import { readFileAsString, readFiles } from "../utils/readFiles";
import * as typescript from "typescript";
// import { generateNavbar } from "./generateNavbar";
import packageJSON from "../../package.json";
import { IRegistryJSON } from "@/types/registry.types";

const REGISTRY_DIR = "../registry"; //eg:  registry/:type/:category/{index.ts, docs.tsx, *.examples.ts}
const PATH_TO_REGISTRY_CONFIG = "../configs/registry.json";

let REGISTRY_JSON: IRegistryJSON = {};
let prevRegistry: IRegistryJSON | null | undefined = {};

console.log("Reading previous registry... 📖");

try {
  const prev = fs.readFileSync(PATH_TO_REGISTRY_CONFIG, "utf-8");
  prevRegistry = JSON.parse(prev);
  console.log("Previous registry found, Starting incremental build... 🏗️\n");
} catch (e) {
  console.log("No previous registry found, Starting fresh build... 🏗️\n");
}

// Read the directory :type
const types = readFolders(REGISTRY_DIR);
const METHODS: any = [];

if (!types || types.length === 0) {
  console.error("No files found in the registry. Exiting...");
  process.exit(1);
}

types.forEach((type) => {
  REGISTRY_JSON[type] = {};
  // Read the directory /:type/:category
  const pathUptoType = REGISTRY_DIR + "/" + type;
  const categories = readFolders(pathUptoType);
  categories.forEach((category) => {
    const pathUptoCategory = pathUptoType + "/" + category;
    console.log("Reading: ", pathUptoCategory);
    REGISTRY_JSON[type][category] = {
      methods: [],
    }; //initialize the methods array

    // List all the files in /:type/:category ie the methods
    const methods = readFolders(pathUptoCategory);

    console.log(`${methods.length} methods found in ${type}/${category}`);

    methods.forEach((method) => {
      const pathUptoMethod = pathUptoCategory + "/" + method;
      METHODS.push(method);
      const file = readFileAsString(pathUptoMethod + "/index.ts"); //read the file as string
      //if the file is empty or does not exist, log an error and exit
      if (!file) {
        console.error("Error reading file: ", pathUptoMethod + "/index.ts");
        console.error("Either the file does not exist or is empty");
        console.error("Exiting...");
        process.exit(1);
      }

      const ts = file; //typescript code
      const js = typescript.transpileModule(ts, {
        compilerOptions: {
          target: typescript.ScriptTarget.ESNext,
          module: typescript.ModuleKind.ESNext,
        },
      }).outputText; //transpiled to esnext

      const commonjs = typescript.transpileModule(ts, {
        compilerOptions: {
          target: typescript.ScriptTarget.ESNext,
          module: typescript.ModuleKind.CommonJS,
        },
      }).outputText; //transpiled to commonjs

      const updatedMethod = {
        name: method.split(".ts")[0],
        code: {
          typescript: ts,
          javascript: js,
          commonjs,
        },
        param: method.split(".ts")[0].toLowerCase(),
      };

      //@ts-ignore
      //check if the method already exists in the registry
      const prevMethod = prevRegistry[type]?.[category]?.methods?.find(
        (m) => m.name === updatedMethod.name
      );

      //checking if the method is new or not
      if (!prevMethod) {
        console.log(`New method found: ${type}/${category}/${method} 🆕`);
        console.log(
          `Adding ${type}/${category}/${method} to the registry... 📝\n`
        );

        REGISTRY_JSON[type][category].methods.push({
          ...updatedMethod,
          createdAt: {
            date: new Date().toISOString(),
            packageVersion: packageJSON.version,
          },
          lastUpdated: {
            date: new Date().toISOString(),
            packageVersion: packageJSON.version,
          },
        });
        return;
      } else {
        //if the method already exists, check if the code has changed
        if (prevMethod.code.typescript === updatedMethod.code.typescript) {
          REGISTRY_JSON[type][category].methods.push(prevMethod);
        } else {
          //if the code has changed, update the lastUpdated field and push the method to the registry
          console.log(`Some changes found in ${type}/${category}/${method} 🔄`);
          REGISTRY_JSON[type][category].methods.push({
            ...updatedMethod,
            createdAt: prevMethod.createdAt,
            lastUpdated: {
              date: new Date().toISOString(),
              packageVersion: packageJSON.version,
            },
          });
        }
      }
    });

    console.log(
      `Completed reading ${methods.length} methods in ${type}/${category} 🔥\n`
    );
  });
});

console.log("Completed reading all methods 🥴\n");

//check if all the methods are unique
console.log("Checking for duplicate methods... 🧐");

//@ts-ignore
const uniqueMethods = [...new Set(METHODS)];
if (uniqueMethods.length !== METHODS.length) {
  console.error("Error: Duplicate methods found 💀");
  console.error("Exiting... 🏃‍♂️");
  process.exit(1);
}
console.log("No duplicate methods found 🎉\n");

//write the registry to a file
console.log("Writing registry to file... 📝");
fs.writeFileSync(
  PATH_TO_REGISTRY_CONFIG,
  JSON.stringify(REGISTRY_JSON, null, 2)
);
console.log("Registry written to file registry.json 🎉\n");

//generate navbar
// generateNavbar();

console.log("Script execution completed. ⭐⭐");
