import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return <div>Hello World</div>;
};
export default Docs;

export const Info: IDoc = {
  description: "Chunks an array into smaller arrays of a specified size.",
  externalLinks: [
    {
      label: "lodash",
      url: "https://lodash.com/docs/4.17.15#chunk",
    },
    {
      label: "lodash",
      url: "https://lodash.com/docs/4.17.15#chunk",
    },
    {
      label: "lodash",
      url: "https://lodash.com/docs/4.17.15#chunk",
    },
  ],
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to process.",
    type: "array",
  },
  {
    title: "size",
    required: false,
    defaultValue: "1",
    propDesc: "The length of each chunk.",
    type: "number",
  },
  {
    title: "strict",
    required: false,
    defaultValue: "false",
    propDesc:
      "If true, the last chunk will be truncated if it does not fit exactly.",
    type: "boolean",
  },
];
