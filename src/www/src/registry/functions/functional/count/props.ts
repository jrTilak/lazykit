import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The function calculates count of exceution of func passed. The function receives a function as an argument.",
    type: "Function",
  }
];

export default Props;
