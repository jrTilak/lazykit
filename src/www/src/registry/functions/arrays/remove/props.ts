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
    title: "index(s)",
    required: true,
    defaultValue: undefined,
    propDesc: "The index(es) of the array to be removed.",
    type: "number | number[]",
  },
];

export default Props;
