import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array from which to partition elements.",
    type: "array",
  },
  {
    title: "predicate",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The function used to determine the partition. It should return a boolean value.",
    type: "function",
  },
];

export default Props;
