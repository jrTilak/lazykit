import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "args",
    required: true,
    defaultValue: undefined,
    propDesc: "The arguments to perform the NAND operation on.",
    type: "any[]",
  },
];

export default Props;