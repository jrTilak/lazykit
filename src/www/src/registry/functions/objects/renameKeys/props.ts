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
    title: "keys",
    required: true,
    defaultValue: undefined,
    propDesc:
      "An array of objects where each object has 'old' (the key to rename) and 'new' (the new key name) properties.",
    type: "Array<{ old: string; new: string; }>",
  },
];

export default Props;
