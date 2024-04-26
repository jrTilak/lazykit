import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "arr",
    required: true,
    defaultValue: undefined,
    propDesc: "The arrays to be zipped.",
    type: "array[]",
  },
  {
    title: "strict",
    required: false,
    defaultValue: "false",
    propDesc:
      "If true, the zipping will be done strictly based on the minimum length of the arrays.",
    type: "boolean",
  },
];

export default Props;
