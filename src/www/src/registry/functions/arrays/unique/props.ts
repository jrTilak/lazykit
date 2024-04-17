import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "arr",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to process",
    type: "any[]",
  },
];

export default Props;