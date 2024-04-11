import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The mapObj function is a utility function that applies a
        callback function to each property of an input object and returns a new
        object with the results. This function is similar to the
        Array.prototype.map method for arrays, but it works with objects.
      </p>
      <p>
        The function is generic and can work with objects of any type. It takes
        two type parameters: T and U. T is the type of the values in the input
        object, and U is the type of the values in the output object.
      </p>
      <p>
        The function accepts two parameters: obj and callback. obj is the input
        object, and callback is a function that gets applied to each property of
        obj. The callback function takes three parameters: value, key, and obj.
        value is the current property's value, key is the current property's
        key, and obj is the original input object.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description: "Same as Array.prototype.map, but for objects.",
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "object",
    required: true,
    defaultValue: undefined,
    propDesc: "The object to process.",
    type: "object",
  },
  {
    title: "callback",
    required: true,
    defaultValue: undefined,
    propDesc:
      "The callback function to apply to each property. It receives the value, key, and object as arguments.",
    type: "function",
  },
];
