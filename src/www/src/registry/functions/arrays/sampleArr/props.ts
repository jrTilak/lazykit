import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "size",
    required: true,
    defaultValue: undefined,
    propDesc: "The size of the array to generate, must be a positive number.",
    type: "number",
  },
];

export default Props;