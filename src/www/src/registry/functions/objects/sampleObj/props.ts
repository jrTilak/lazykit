import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "keys",
    required: true,
    defaultValue: undefined,
    propDesc: "The keys for the object.",
    type: "string[]",
  },
];

export default Props;
