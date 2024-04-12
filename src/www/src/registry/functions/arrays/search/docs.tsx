import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The search function is a utility function in JavaScript that performs a
        search operation on an array of objects based on a provided query string
        and keys. This function is particularly useful when you need to filter
        an array of objects based on certain criteria.
      </p>
      <p>
        The function accepts three parameters: the original array to be
        searched, the query string, and an array of keys. The array should
        consist of objects, the query string is the value to be searched for,
        and the keys are the properties of the objects to be searched.
      </p>
      <p>
        The function iterates over each object in the array, and for each
        object, it checks if any of the specified keys contain the query string.
        If a match is found, the object is included in the returned array. If no
        keys are provided, the function returns an empty array. If the query
        string is empty, the function returns the original array. This allows
        for flexible and powerful search functionality within your JavaScript
        applications.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description:
    "Search objects in an array based on provided keys and query string. It only works with string and number values.",
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "array",
    required: true,
    defaultValue: undefined,
    propDesc: "The array of objects to process.",
    type: "object[]",
  },
  {
    title: "queryString",
    required: true,
    defaultValue: undefined,
    propDesc: "The query string to search for.",
    type: "string",
  },
  {
    title: "keys",
    required: true,
    defaultValue: undefined,
    propDesc: "Keys of the object to search within.",
    type: "string[]",
  },
];
