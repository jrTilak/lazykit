import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The insert function is a generic function in TypeScript that is designed
        to insert elements into an array at a specified index. The function
        takes four parameters: an array arr of type T[], an index of type
        number, a spread parameter items of type T[], and an optional recursive
        parameter of type boolean which defaults to false.
      </p>
      <p>
        It returns a new array with the elements inserted at the specified index
        without modifying the original array.
      </p>
      <p>
        If the index is negative, the function treats it as an index from the
        end of the array. In this case, it converts the index to a positive
        number and reverses the array and the items to be inserted for easier
        insertion.
      </p>
      <p>
        If the recursive parameter is false, the function simply inserts the
        items at the specified index in the array. If the recursive parameter is
        true, the function inserts the items at every nth index, where n is the
        absolute value of the provided index. The function calculates the number
        of insertions to be made by dividing the length of the array by the
        index.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description: "Inserts elements into an array at a specified index.",
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
    title: "index",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The index at which to insert the elements, If negative, the index will start from the end of the array.",
    type: "number",
  },
  {
    title: "items",
    required: true,
    defaultValue: undefined,
    propDesc: "The elements to insert into the array.",
    type: "array",
  },
  {
    title: "strict",
    required: false,
    defaultValue: "false",
    propDesc:
      "Indicates whether to insert elements recursively. If true, the elements will be inserted at every nth index.",
    type: "boolean",
  },
];
