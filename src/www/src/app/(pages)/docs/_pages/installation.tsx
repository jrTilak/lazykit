import { PACKAGE_INFO } from "@/data/info";
import { Metadata } from "next";
import CodeLine from "../_components/code-line";
import Table from "../_components/table";
import Link from "next/link";

const Installation = () => {
  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-12">
        <div className="flex flex-col gap-2">
          <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-bold">
            Installation
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Learn how to install the utility methods in your project.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="introduction"
          >
            <span>1. Introduction</span>
            <hr />
          </h3>
          <p>
            One of the way to add utility methods to your project is by just
            copying the code and pasting it in your project. But, this is not
            the best way to do it. The best way to do it is by using the CLI
            program provided by lazykit. The CLI program will add the utility
            method to your project in a more efficient way.
          </p>
          <p>
            For initializing the project,{" "}
            <Link href="/docs/cli" className="text-purple-600 underline">
              see this section
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="add-method"
          >
            <span>2. Add method</span>
            <hr />
          </h3>
          <p>
            To add the method in you project, you can run the following command.
          </p>
          <p className="text-sm text-red-800 dark:text-red-200 dark:opacity-65">
            Note: If you have not initialized the project, then you need to give
            the path and language after running the command or as flags.
          </p>
          <CodeLine
            showLangFlag={false}
            code="npx @jrtilak/lazykit@latest add <method-name> [flags]"
            language="bash"
          />
        </div>
        <div className="flex flex-col gap-3 overflow-x-hidden">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="flags"
          >
            <span>3. Flags</span>
            <hr />
          </h3>
          <p>
            The following flags can be used while adding the method in your
            project.
          </p>
          <div className="overflow-x-auto">
            <Table {...tableData} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Installation;

export const installationMetaData: Metadata = {
  title: "Installation | " + PACKAGE_INFO.name,
};

const tableData = {
  classNames: {
    headers: "grid-cols-5",
    content: "grid-cols-5",
    contentLabel: ["col-span-1", "col-span-1", "col-span-3"],
    headersLabel: ["col-span-1", "col-span-1", "col-span-3"],
  },
  headers: [
    {
      label: "Flag",
    },
    {
      label: "Alias",
      desc: "The short form of the flag.",
    },
    {
      label: "Description",
    },
  ],
  content: [
    [
      {
        label: "--javascript",
      },
      {
        label: "-js",
      },
      {
        label: "Add the method in javascript",
      },
    ],
    [
      {
        label: "--typescript",
      },
      {
        label: "-ts",
      },
      {
        label: "Add the method in typescript",
      },
    ],
    [
      {
        label: "--path <path>",
      },
      {
        label: "-p <path>",
      },
      {
        label: "Add the method in the given path",
      },
    ],
  ],
};
