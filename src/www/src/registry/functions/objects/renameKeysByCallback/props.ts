import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "object",
    required: true,
    defaultValue: undefined,
    propDesc: "The object from which to rename keys.",
    type: "object",
  },
  {
    title: "callback",
    required: true,
    defaultValue: undefined,
    propDesc:
      "A callback function that evaluates the new key name based on the old key.",
    type: "(oldKey: string) => string",
  },
];

export default Props;
