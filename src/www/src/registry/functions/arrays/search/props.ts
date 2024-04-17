import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array of objects to process.",
    type: "object[]",
  },
  {
    title: "queryString",
    required: true,
    defaultValue: undefined,
    propDesc: "The query string to search for.",
    type: "string",
  },
  {
    title: "keys",
    required: true,
    defaultValue: undefined,
    propDesc: "Keys of the object to search within.",
    type: "string[]",
  },
];

export default Props;