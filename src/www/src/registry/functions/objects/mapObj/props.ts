import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "object",
    required: true,
    defaultValue: undefined,
    propDesc: "The object to process.",
    type: "object",
  },
  {
    title: "callback",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The callback function to apply to each property. It receives the value, key, and object as arguments.",
    type: "function",
  },
];

export default Props;
