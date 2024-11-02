import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "defaultValue",
    required: false,
    defaultValue: "false",
    propDesc: "Initial value of the boolean state.",
    type: "boolean",
  },
];

export default Props;
