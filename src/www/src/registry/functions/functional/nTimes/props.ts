import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The function called `n` times. The function receives the current iteration index as an argument.",
    type: "Function",
  },
  {
    title: "n",
    required: false,
    defaultValue: "1",
    propDesc: "The number of times to call the function.",
    type: "number",
  },
];

export default Props;
