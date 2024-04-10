import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IRegistryFunctionPropTable } from "@/types/registry.types";
import { Info } from "lucide-react";

type Props = {
  data: IRegistryFunctionPropTable[];
};
const PropsTable = ({ data }: Props) => {
  return (
    <div className="flex flex-col min-w-[500px]">
      <div className="grid grid-cols-3 gap-2 px-6 py-2 rounded-t-sm bg-gray-300 dark:bg-gray-800">
        <div className="mr-auto flex gap-3 items-center">
          <h4>Prop</h4>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground " />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Props marked with <span className="text-primary">*</span> are
                  required.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h4 className="mx-auto">
          <span>Type</span>
        </h4>
        <h4 className="ml-auto">
          <span className="truncate">Default Value</span>
        </h4>
      </div>
      {data.map((prop, index) => (
        <div
          key={index}
          className={cn(
            "grid grid-cols-3 gap-2 px-6 py-2 even:bg-gray-100 dark:even:bg-gray-900 odd:bg-gray-200 dark:odd:bg-gray-800 text-muted-foreground",
            index === data.length - 1 && "rounded-b-sm"
          )}
        >
          <span className="mr-auto flex items-center gap-4">
            <span>
              {prop.title}
              {prop.required && <span className="text-primary">*</span>}
            </span>
            {prop.propDesc && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{prop.propDesc}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </span>
          <span className="mx-auto flex items-center gap-4">
            <span>{prop.type}</span>
            {prop.type === "enum" ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{prop.enums?.join(" | ")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              prop.typeDesc && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{prop.typeDesc}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
          </span>
          <span className="ml-auto">{prop.defaultValue ?? "---"}</span>
        </div>
      ))}
    </div>
  );
};

export default PropsTable;
