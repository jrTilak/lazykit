import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to be processed into chunks.",
    type: "array",
  },
  {
    title: "size",
    required: true,
    defaultValue: undefined,
    propDesc: "The desired length of each chunk.",
    type: "number",
  },
  {
    title: "config.style",
    required: false,
    defaultValue: "normal",
    propDesc:
      "Determines the behavior of the last chunk: 'normal' keeps it as is, 'repeat' fills the last chunk with elements from the start if it doesn't fit the specified size, and 'remove' truncates the last chunk if its length is not equal to the specified size.",
    type: "enum",
    enums: ["normal", "repeat", "remove"],
  },
];

export default Props;
