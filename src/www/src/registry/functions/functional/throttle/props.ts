import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc: "The function to to throttle.",
    type: "Function",
  },
  {
    title: "limit",
    required: true,
    defaultValue: "300",
    type: "number",
    propDesc: "The limit for throttle in milliseconds",
  },
];

export default Props;
