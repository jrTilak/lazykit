import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The retry function retries the given function a specified number of
        times with a delay between each retry. If the function succeeds within
        the specified number of retries, the Promise will resolve with the
        result of the function. If the function fails on all retries, the
        Promise will be rejected with the last error. The retry function is
        designed to handle both synchronous and asynchronous functions, as it
        wraps the call to fn with Promise.resolve. This ensures that fn is
        always treated as a Promise, allowing the use of .then and .catch to
        handle the result or any errors.
      </p>
      <p>
        The function retries the given function a specified number of times. The
        total number of times a function is called is retries + 1.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description:
    "Retries the given function a specified number of times with a delay between each retry.",
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "function",
    required: true,
    defaultValue: undefined,
    propDesc: "The function to retry.",
    type: "Function",
  },
  {
    title: "retries",
    required: false,
    defaultValue: "3",
    propDesc: "The number of times to retry the function.",
    type: "number",
  },
  {
    title: "delay",
    required: false,
    defaultValue: "1000",
    propDesc: "The delay in milliseconds between each retry.",
    type: "number",
  },
];
