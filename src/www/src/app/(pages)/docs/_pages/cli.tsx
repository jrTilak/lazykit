import Link from "next/link";
import CodeLine from "../_components/code-line";
import { Metadata } from "next";
import { PACKAGE_INFO } from "@/data/info";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Table from "../_components/table-comp";

const CLI = () => {
  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-12">
        <div className="flex flex-col gap-2">
          <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-bold">CLI</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            CLI program for adding utility methods to your the project for
            lazykit like a pro.
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
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="initial-setup"
          >
            <span>2. Initial Setup</span>
            <hr />
          </h3>
          <p>For the initial setup, you can run the following command.</p>
          <p className="text-sm text-red-800 dark:text-red-200 dark:opacity-60">
            Note: To initialize the project, you need to have a{" "}
            <code className="text-fuchsia-400">package.json</code> file in your
            project.
          </p>
          <CodeLine
            showLangFlag={false}
            code="npx @jrtilak/lazykit@latest init"
            language="bash"
          />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h4 className="text-lg sm:text-xl">I. Questions</h4>
                <p>
                  This will ask you a few questions with its default values.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full max-w-4xl">
                {[
                  {
                    qn: "Confirm the language for the project:",
                    desc: "The language of the project. It can be either TypeScript or JavaScript. By default, it will try to detect the language from the project.",
                  },
                  {
                    qn: "Enter the path to store the utility methods: ",
                    default: "src/utils",
                    desc: "This is the path where the utility methods will be stored in your project.<br/><br/> For now, you cannot use tab key to autocomplete the path. You have to enter the path manually. ",
                  },
                  {
                    qn: "Do you want to store the configuration in a separate file? ",
                    default: "false",
                    desc: "If true, it will store the configuration in a separate file called lazykit.config.json. <br/><br/> If false, it will store the configuration in the package.json file.",
                  },
                ].map((item, index) => (
                  <AccordionItem key={index} value={item.qn}>
                    <AccordionTrigger>{item.qn}</AccordionTrigger>
                    <AccordionContent className="text-base">
                      {item.desc && (
                        <p dangerouslySetInnerHTML={{ __html: item.desc }} />
                      )}
                      {item.default && (
                        <span className="flex gap-3 items-center text-muted-foreground">
                          Default value:{" "}
                          <code className="text-fuchsia-400">
                            {item.default}
                          </code>
                        </span>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 overflow-x-hidden">
                <h4 className="text-lg sm:text-xl">II. Flags</h4>
                <p>
                  You can pass the following flags to the init command to skip
                  the questions.
                </p>
                <div className="overflow-x-auto">
                  <Table {...cliDetails} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="teardown"
          >
            <span>3. Teardown</span>
            <hr />
          </h3>
          <p>This command will remove the config file from your project.</p>
          <CodeLine
            showLangFlag={false}
            code="npx @jrtilak/lazykit@latest teardown"
            language="bash"
          />
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="installation"
          >
            <span>4. Installation</span>
            <hr />
          </h3>
          <p>
            For the installation, of the methods you can run the following
            command
          </p>
          <CodeLine
            showLangFlag={false}
            code="npx @jrtilak/lazykit@latest add <method-name>"
            language="bash"
          />
          <p>
            For detail docs see{" "}
            <Link href="installation" className="text-purple-600 underline">
              Installation
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};
export default CLI;

export const cliMetaData: Metadata = {
  title: "CLI | " + PACKAGE_INFO.name,
  description:
    "CLI program for adding utility methods to your the project for lazykit like a pro.",
};

const cliDetails = {
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
        label: "Initialize the project with javascript",
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
        label: "Initialize the project with typescript",
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
        label: "Initialize the project in the given path",
      },
    ],
    [
      {
        label: "--force",
      },
      {
        label: "-f",
      },
      {
        label:
          "Force initialize the project, even if the project is already initialized",
      },
    ],
    [
      {
        label: "--separate",
      },
      {
        label: "-s",
      },
      {
        label:
          "Initialize the project configuration in separate file called lazykit.config.js else in package.json",
      },
    ],
  ],
};
