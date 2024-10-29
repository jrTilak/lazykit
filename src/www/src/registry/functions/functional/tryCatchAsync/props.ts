import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "fn",
    required: true,
    defaultValue: undefined,
    propDesc:
      "An async function that returns a Promise. It will be executed within a try-catch to handle success or error.",
    type: "Function",
  },
];

export default Props;
