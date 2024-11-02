import { IRegistryFunctionPropTable } from "@/types/registry.types";

const Props: IRegistryFunctionPropTable[] = [
  {
    title: "key",
    required: true,
    defaultValue: undefined,
    propDesc: "The key under which the value is stored in local storage.",
    type: "string",
  },
  {
    title: "defaultValue",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The default value to return if the item doesn't exist in local storage.",
    type: "Value", // Here, Value is a generic type that will be replaced during actual usage.
  },
  {
    title: "config",
    required: false,
    defaultValue: "{ defaultParser: true }",
    propDesc:
      "An optional configuration object or function for parsing the stored value.",
    type: "GetConfig<Value>",
  },
];

export default Props;
