import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to process.",
    type: "array",
  },
  {
    title: "size",
    required: false,
    defaultValue: "1",
    propDesc: "The length of each chunk.",
    type: "number",
  },
  {
    title: "strict",
    required: false,
    defaultValue: "false",
    propDesc:
      "If true, the last chunk will be truncated if it does not fit exactly.",
    type: "boolean",
  },
];

export default Props;
