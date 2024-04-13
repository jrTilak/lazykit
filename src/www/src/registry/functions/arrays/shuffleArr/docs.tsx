import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The shuffleArr function is a utility function in JavaScript that takes
        an array and shuffles it. The function uses the Fisher-Yates algorithm
        to shuffle the array. The Fisher-Yates algorithm is an efficient
        algorithm for generating a random permutation of a finite sequence. The
        function returns a new array with the elements of the original array
        shuffled.
      </p>
      <p>
        The shuffleArr function does not modify the original array, it returns a
        new array with the elements shuffled.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description: "Shuffles the elements of an array.",
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "arr",
    required: true,
    defaultValue: undefined,
    propDesc: "The array to shuffle.",
    type: "any[]",
  },
];
