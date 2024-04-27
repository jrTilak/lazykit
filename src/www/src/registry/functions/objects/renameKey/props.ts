import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "object",
    required: true,
    defaultValue: undefined,
    propDesc: "The object from which to rename a key.",
    type: "object",
  },
  {
    title: "key",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The key to rename. The key must be of the same type as the keys of the input object.",
    type: "string",
  },
  {
    title: "newKey",
    required: true,
    defaultValue: undefined,
    propDesc: "The name of the new key.",
    type: "string",
  },
];

export default Props;
