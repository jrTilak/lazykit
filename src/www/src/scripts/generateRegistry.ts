import * as fs from "fs";
import { readFolders } from "../utils/readFolders";
import { readFileAsString, readFiles } from "../utils/readFiles";
import * as typescript from "typescript";
import packageJSON from "../../package.json";
import { IRegistryJSON } from "@/types/registry.types";
import { generateNavbar } from "./generateNavbar";

//eg:  registry/:type/:category/{index.ts, docs.tsx, *.examples.ts}
const REGISTRY_DIR = "../registry";

const PATH_TO_REGISTRY_CONFIG = "../configs/registry.json";
const NECESSARY_FILES = [
  "index.ts",
  "index.test.ts",
  "docs.tsx",
  // "*.example.ts",
];

let REGISTRY_JSON: IRegistryJSON[] = [];
let prevRegistry: IRegistryJSON[] | undefined;

console.log("Reading previous registry... 📖");

try {
  const prev = fs.readFileSync(PATH_TO_REGISTRY_CONFIG, "utf-8");
  prevRegistry = JSON.parse(prev);
  console.log("Previous registry found, Starting incremental build... 🏗️\n");
} catch (e) {
  console.log("No previous registry found, Starting fresh build... 🏗️\n");
}

/**
 *  Read the directory :type
 * Type can be any of the following for example: function (javascript utility functions), react-hooks, etc
 **/
const types = readFolders(REGISTRY_DIR);
const METHODS: any = [];

/**
 * If no files are found in the registry, log an error and exit
 * Else, continue with the script
 */
if (!types || types.length === 0) {
  console.error("No files found in the registry. Exiting...");
  process.exit(1);
}

/**
 * Loop through all the types
 */
types.forEach((type) => {
  /**
   * Read the directory /:type/:category
   * Category can be any of the following for example: array, object, string, etc
   **/
  const pathUptoType = REGISTRY_DIR + "/" + type;

  /**
   * List all the folders in /:type
   * Each folder is a category with a set of methods
   * For example: array, object, string, etc
   * Loop through all the categories
   */
  const categories = readFolders(pathUptoType);
  categories.forEach((category) => {
    const pathUptoCategory = pathUptoType + "/" + category;
    console.log("Reading: ", pathUptoCategory);

    /**
     * List all the folders in /:type/:category
     * Each folder is a method's content like index.ts, docs.tsx, etc
     */
    const methods = readFolders(pathUptoCategory);
    console.log(`${methods.length} methods found in ${type}/${category}`);

    /**
     * Loop through all the methods
     * Each method has a set of files like index.ts, docs.tsx, etc
     */
    methods.forEach((method) => {
      const pathUptoMethod = pathUptoCategory + "/" + method;

      /**
       * This is a temporary array to store all the methods so that we can check if all the methods are unique or not
       */
      METHODS.push(method);

      /**
       * Check if all the necessary files are present in the method folder
       * If not, log an error and exit
       * Else, continue with the script
       */
      const availableFiles = readFiles(pathUptoMethod);
      /**
       * Check if at least one example file is present in the method folder
       */
      const exampleFiles = availableFiles.filter((file) =>
        file.includes(".example.ts")
      );
      if (exampleFiles.length === 0) {
        console.error(
          `Error: No example file found in ${type}/${category}/${method}. 😐\nExiting...`
        );
        process.exit(1);
      }

      const examples = exampleFiles.map((file) =>
        readFileAsString(pathUptoMethod + "/" + file)
      );

      /**
       * Add the example files in the registry
       */

      /**
       * Check if all the necessary files are present in the method folder
       */
      const missingFiles = NECESSARY_FILES.filter(
        (file) => !availableFiles.includes(file)
      );
      if (missingFiles.length > 0) {
        console.error(
          `Error: ${missingFiles.join(
            ", "
          )} missing in ${type}/${category}/${method}. 😐\nExiting...`
        );
        process.exit(1);
      }

      /**
       * Read the docs.tsx file as string
       * See if that file exports a default object and another object named Info with name, description as compulsory fields and externalLinks as optional fields. If externalLinks is present, it should be an array of objects with label and url as compulsory fields.
       */
      
      const docsData = readFileAsString(pathUptoMethod + "/docs.tsx");
      // todo: complete this

      /**
       * Read the index.ts file as string
       * Transpile the typescript code to javascript and commonjs
       */
      const fileData = readFileAsString(pathUptoMethod + "/index.ts"); //read the file as string
      const ts = fileData; //typescript code
      const js = typescript.transpileModule(ts, {
        compilerOptions: {
          target: typescript.ScriptTarget.ESNext,
          module: typescript.ModuleKind.ESNext,
        },
      }).outputText; //transpiled to esnext

      /**
       * Create an object with the method name, code, category, type
       */
      const updatedMethod = {
        name: method.split(".ts")[0],
        code: {
          ts,
          js,
        },
        category,
        type,
        examples,
      };

      /**
       * Check if the method already exists in the registry
       * If not, add the method to the registry
       * If yes, check if the code has changed
       * If the code has changed, update the lastUpdated field and push the method to the registry
       * If the code has not changed, push the method to the registry
       */
      const prevMethod = prevRegistry?.find(
        (m) =>
          m.name === updatedMethod.name &&
          m.category === category &&
          m.type === type
      );

      //checking if the method is new or not
      if (!prevMethod) {
        console.log(`New method found: ${type}/${category}/${method} 🆕`);
        console.log(
          `Adding ${type}/${category}/${method} to the registry... 📝\n`
        );

        REGISTRY_JSON.push({
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
        if (prevMethod.code.ts === updatedMethod.code.ts) {
          //check if the examples have changed
          if (
            JSON.stringify(prevMethod.examples) ===
            JSON.stringify(updatedMethod.examples)
          ) {
            console.log(
              `No changes found in example of ${type}/${category}/${method} 🚫`
            );

            REGISTRY_JSON.push(prevMethod);
          } else {
            //if the examples have changed, update the lastUpdated field and push the method to the registry
            console.log(
              `Some changes found in example of ${type}/${category}/${method} 🔄`
            );
            REGISTRY_JSON.push({
              ...updatedMethod,
              createdAt: prevMethod.createdAt,
              lastUpdated: prevMethod.lastUpdated,
            });
          }
        } else {
          //if the code has changed, update the lastUpdated field and push the method to the registry
          console.log(`Some changes found in ${type}/${category}/${method} 🔄`);
          REGISTRY_JSON.push({
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
generateNavbar();

console.log("Script execution completed. ⭐⭐");
