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
    title: "strict",
    required: false,
    defaultValue: "false",
    propDesc: "If true, also removes empty objects and arrays from the array.",
    type: "boolean",
  },
];

export default Props;
