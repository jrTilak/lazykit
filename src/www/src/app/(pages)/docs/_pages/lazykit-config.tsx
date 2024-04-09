import { PACKAGE_INFO } from "@/data/info";
import { Metadata } from "next";
import Table from "../_components/Table";

const LazykitConfig = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-12">
      <div className="flex flex-col gap-2">
        <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-bold">
          lazykit.config.json
        </h1>
        <p className="text-sm sm:text-base md:text-lg">
          It is json object that contains the configuration for the lazykit CLI.
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
          It is used while installing the utility methods in your project to
          detect the location of the utility methods in your project and it's
          language.
        </p>
        <p>
          This configuration object can be stored inside{" "}
          <code className="text-fuchsia-700">package.json</code> or in a
          separate file named{" "}
          <code className="text-fuchsia-700">lazykit.config.json</code> which
          you can choose while initializing the project.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h3
          className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
          id="description"
        >
          <span>2. Description</span>
          <hr />
        </h3>
        <Table {...tableData} />
      </div>
    </div>
  );
};
export default LazykitConfig;

export const lazykitConfigMetaData: Metadata = {
  title: "lazykit-config | " + PACKAGE_INFO.name,
  description:
    "CLI program for adding utility methods to your the project for lazykit like a pro.",
};

const tableData = {
  headers: [
    {
      label: "Key",
    },
    {
      label: "Description",
    },
  ],
  content: [
    [
      {
        label: "language",
      },
      {
        label: "The language of the project.",
      },
    ],
    [
      {
        label: "path",
      },
      {
        label:
          "The path where the utility methods will be stored in your project.",
      },
    ],
    [
      {
        label: "separate",
      },
      {
        label:
          "If true, it means the configuration is stored in a separate file called lazykit.config.json.",
      },
    ],
    [
      {
        label: "v",
      },
      {
        label: "The version of the lazykit CLI.",
      },
    ],
  ],
  classNames: {
    headers: "grid-cols-4",
    content: "grid-cols-4",
    contentLabel: ["col-span-1", "col-span-3"],
    headersLabel: ["col-span-1", "col-span-3"],
  },
};
