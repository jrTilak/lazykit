import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "object",
    required: true,
    defaultValue: undefined,
    propDesc: "The object to filter.",
    type: "object",
  },
  {
    title: "predicate",
    required: true,
    defaultValue: undefined,
    propDesc:
      "A function that takes the value, key, object and returns true if the property should be included.",
    type: "(value, key, object) => boolean",
  },
];

export default Props;
