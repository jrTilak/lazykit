import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The unique function is a utility function in JavaScript that takes an
        array and returns a new array with all duplicate values removed. The
        function uses set to remove duplicate values from the array.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description: "Creates a unique array from the input array.",
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "arr",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to process",
    type: "any[]",
  },
];
