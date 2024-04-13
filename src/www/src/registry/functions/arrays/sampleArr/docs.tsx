import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        This sampleArr function is a utility function in JavaScript that takes a
        size parameter and generates an array of random numbers. The size
        parameter specifies the length of the array to generate. The function
        uses the Math.random() method to generate random numbers between 0 and
        the specified size. The function returns an array of random numbers with
        the specified length.
      </p>
      <p>
        The function throws an error if the size parameter is a negative number.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description: "Generates an array of random numbers.",
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "size",
    required: true,
    defaultValue: undefined,
    propDesc: "The size of the array to generate, must be a positive number.",
    type: "number",
  },
];
