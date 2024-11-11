import * as fs from "fs";
import { readFolders } from "../helpers/readFolders";
import { readFileAsString, readFiles } from "../helpers/readFiles";
import * as typescript from "typescript";
import { IRegistryJSON } from "@/types/registry.types";
import { generateNavbar } from "./generateNavbar";
import { formatCode } from "@/helpers/format-code";
import React from "react";

//eg:  registry/:type/:category/{index.ts, docs.tsx, *.examples.ts}
const REGISTRY_DIR = "../registry";

const PATH_TO_REGISTRY_CONFIG = "../.generated/registry.tsx";
const NECESSARY_FILES = ["index.ts", "index.test.ts", "docs.mdx"];

let REGISTRY_JSON: Record<string, IRegistryJSON> = {};
/**
 *  Read the directory :type
 * Type can be any of the following for example: functions (javascript utility functions), react-hooks, etc
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
async function main() {
  await Promise.all(
    types.map(async (type) => {
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
      await Promise.all(
        categories.map(async (category) => {
          const pathUptoCategory = pathUptoType + "/" + category;
          console.log("Reading: ", pathUptoCategory);

          /**
           * List all the folders in /:type/:category
           * Each folder is a method's content like index.ts, docs.tsx, etc
           */
          const methods = readFolders(pathUptoCategory).sort();
          console.log(`${methods.length} methods found in ${type}/${category}`);

          /**
           * Loop through all the methods
           * Each method has a set of files like index.ts, docs.tsx, etc
           */
          await Promise.all(
            methods.map(async (method) => {
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
               * Add the example files in the registry
               */
              const examples = availableFiles.filter((file) =>
                file.match(/examples?\.tsx?/)
              );

              const exampleFiles: IRegistryJSON["examples"] = {};
              await Promise.all(
                examples.map(async (exampleFile) => {
                  const exampleFileDataAsString = readFileAsString(
                    pathUptoMethod + "/" + exampleFile
                  );
                  const key = exampleFile.replace(/.examples?\.tsx?/, "");
                  const path = `@/registry/${type}/${category}/${method}/${exampleFile.replace(/.tsx?/, "")}`;
                  const ts = exampleFileDataAsString;
                  const content = await import(path);
                  if (!content.default) {
                    console.error(
                      `Error: Default export missing in ${type}/${category}/${method}/${exampleFile}. 😐\nExiting...`
                    );
                    process.exit(1);
                  }
                  exampleFiles[key] = {
                    // @ts-expect-error: below we are changing the type of component to React component
                    component: path,
                    code: {
                      tsx: await formatCode(ts, "typescript"),
                    },
                  };
                })
              );

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
               * See if that file exports a default object and another object named Info with  description as compulsory field and externalLinks as optional fields. If externalLinks is present, it should be an array of objects with label and url as compulsory fields.
               */

              const docsMd = readFileAsString(pathUptoMethod + "/docs.mdx");

              // Check if default export is present
              if (!docsMd) {
                console.error(
                  `Error: docs.mdx file is missing in ${type}/${category}/${method}/. 😐\nExiting...`
                );
                process.exit(1);
              }

              /**
               * Check if the index.ts file has default export
               */
              const indexData = await import(
                `@/registry/${type}/${category}/${method}/index.ts`
              );
              if (!indexData.default) {
                console.error(
                  `Error: Default export missing in ${type}/${category}/${method}/index.ts. 😐\nExiting...`
                );
                process.exit(1);
              }

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
                  ts: await formatCode(ts, "typescript"),
                  js: await formatCode(js, "babel"),
                },
                examples: exampleFiles,
                category,
                type,
              };

              //checking if the method is new or not
              console.log(
                `Adding ${type}/${category}/${method} to the registry... 📝\n`
              );

              REGISTRY_JSON[updatedMethod.name] = updatedMethod;
              return;
            })
          );
        })
      );
    })
  );
  console.log("Completed reading all methods 🥴\n");
  console.log("Total methods found: " + METHODS.length);

  // sort the registry on the basis of name
  REGISTRY_JSON = Object.keys(REGISTRY_JSON)
    .sort() // Sort the keys
    .reduce((acc: Record<string, IRegistryJSON>, key) => {
      acc[key] = REGISTRY_JSON[key];
      return acc;
    }, {});

  //write the registry to a file
  console.log("Writing registry to file... 📝");

  const registry = `//@ts-nocheck
import { lazy } from "react";
import { IRegistryJSON } from "@/types/registry.types";

const registry = ${JSON.stringify(REGISTRY_JSON, null, 2)} as Record<string, IRegistryJSON>

export default registry;`;

  //  replace the path with lazy import
  const updatedRegistry = registry.replace(
    /"component": "(.*)"/g,
    (match, p1) => {
      return `"component": lazy(() => import("${p1}").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    }))`;
    }
  );

  fs.writeFileSync(PATH_TO_REGISTRY_CONFIG, updatedRegistry);
  console.log("Registry written to file registry.json 🎉\n");

  //generate navbar
  generateNavbar();

  console.log("Script execution completed. ⭐⭐");
}

main();
