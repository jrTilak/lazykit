import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to process.",
    type: "array",
  },
  {
    title: "index",
    required: true,
    defaultValue: undefined,
    propDesc: "The index at which to insert the elements.",
    type: "number",
  },
  {
    title: "items",
    required: true,
    defaultValue: undefined,
    propDesc: "The elements to insert into the array.",
    type: "array",
  },
  {
    title: "strict",
    required: false,
    defaultValue: "false",
    propDesc:
      "Indicates whether to insert elements recursively. If true, the elements will be inserted at every nth index.",
    type: "boolean",
  },
];

export default Props;
