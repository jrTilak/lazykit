import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to rotate.",
    type: "array",
  },
  {
    title: "position",
    required: true,
    defaultValue: undefined,
    propDesc: "The number of positions to rotate the array by.",
    type: "number",
  },
  {
    title: "direction",
    required: false,
    defaultValue: "left",
    propDesc: "The direction in which to rotate the array.",
    type: "enum",
    enums: ["left", "right"],
  },
];

export default Props;
