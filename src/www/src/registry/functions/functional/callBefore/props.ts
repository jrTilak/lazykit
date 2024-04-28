import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc: "The function to be called",
    type: "Function",
  },
  {
    title: "count",
    required: true,
    defaultValue: undefined,
    propDesc: "The number of times the function can be called.",
    type: "number",
  },
];

export default Props;
