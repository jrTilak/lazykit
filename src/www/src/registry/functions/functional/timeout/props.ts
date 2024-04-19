import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc: "The function to be wrapped with a timeout.",
    type: "Function",
  },
  {
    title: "time",
    required: true,
    defaultValue: undefined,
    propDesc: "The timeout duration in milliseconds.",
    type: "number",
  },
  {
    title: "errCb",
    required: false,
    defaultValue: undefined,
    propDesc:
      "Optional error callback function to handle timeout errors. If not provided, the promise will be rejected with an error message.",
    type: "Function",
  },
];

export default Props;
