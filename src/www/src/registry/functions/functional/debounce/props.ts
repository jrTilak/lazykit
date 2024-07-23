import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc: "The function to to debounce.",
    type: "Function",
  },
  {
    title: "delay",
    required: true,
    defaultValue: "300",
    type: "number",
    propDesc: "The delay time for debounce in milliseconds",
  },
];

export default Props;
