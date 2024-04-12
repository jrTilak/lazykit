import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The chunk function is a utility function in JavaScript that takes an
        array and divides it into smaller sub-arrays, or &quot;chunks&quot;, each with a
        maximum length equal to a specified size. This function is particularly
        useful when you need to process a large array in smaller, more
        manageable pieces.
      </p>
      <p>
        The function accepts three parameters: the original array to be chunked,
        the size of each chunk, and a boolean value indicating whether the
        function should strictly adhere to the chunk size. If the &quot;strict&quot;
        parameter is set to true, and the last chunk does not meet the specified
        size, it will be removed from the final result.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description: "Chunks an array into smaller arrays of a specified size.",
};

export const Props: IRegistryFunctionPropTable[] = [
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
