import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "key",
    required: true,
    defaultValue: undefined,
    propDesc: "The key under which the value will be stored in localStorage.",
    type: "string",
  },
  {
    title: "value",
    required: true,
    defaultValue: undefined,
    propDesc: "The value to store in localStorage. Can be any data type.",
    type: "unknown",
  },
  {
    title: "config",
    required: false,
    defaultValue: "{ defaultParser: true }",
    propDesc:
      "Configuration object for parsing. If `defaultParser` is true, values will be JSON stringified by default. Alternatively, a custom parser function can be provided to process the value before storage.",
    type: "{ defaultParser: boolean } | (value: Value) => string",
  },
];

export default Props;
