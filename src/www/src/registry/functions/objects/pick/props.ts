import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "object",
    required: true,
    defaultValue: undefined,
    propDesc: "The object to pick keys from.",
    type: "object",
  },
  {
    title: "keys",
    required: true,
    defaultValue: undefined,
    propDesc:
      "An array of keys to pick from the object. The keys must be of the same type as the keys of the input object.",
    type: "array",
  },
];

export default Props;
