import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc: "The function to retry.",
    type: "Function",
  },
  {
    title: "retries",
    required: false,
    defaultValue: "3",
    propDesc: "The number of times to retry the function.",
    type: "number",
  },
  {
    title: "delay",
    required: false,
    defaultValue: "1000",
    propDesc: "The delay in milliseconds between each retry.",
    type: "number",
  },
];

export default Props;