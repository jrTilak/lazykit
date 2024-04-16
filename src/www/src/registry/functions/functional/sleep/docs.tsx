import { IDoc, IRegistryFunctionPropTable } from "@/types/registry.types";

const Docs = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        The sleep function sleeps the execution for the specified number of
        milliseconds.
      </p>
      <p>
        It utilizes the setTimeout and Promise APIs to pause the execution for
        the specified number of milliseconds.
      </p>
    </div>
  );
};
export default Docs;

export const Info: IDoc = {
  description: "Sleeps the execution for the specified number of milliseconds.",
};

export const Props: IRegistryFunctionPropTable[] = [
  {
    title: "ms",
    required: true,
    defaultValue: undefined,
    propDesc: "The number of milliseconds to sleep.",
    type: "number",
  },
];
