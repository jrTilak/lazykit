import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "ms",
    required: true,
    defaultValue: undefined,
    propDesc: "The number of milliseconds to sleep.",
    type: "number",
  },
];

export default Props;
