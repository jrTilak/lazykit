import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type Props = {
  classNames?: {
    headers?: string;
    headersLabel?: string[];
    content?: string;
    contentLabel?: string[];
  };
  headers: {
    label: string;
    desc?: string;
  }[];
  content: {
    label: string;
    desc?: string;
  }[][];
};
const Table = ({ headers, content, classNames }: Props) => {
  return (
    <div className="flex flex-col min-w-[500px]">
      <div
        className={cn(
          "grid gap-2 px-6 py-2 rounded-t-sm bg-gray-300",
          `grid-cols-${headers.length}`,
          classNames?.headers
        )}
      >
        {headers.map((h, i) => (
          <div
            key={i}
            className={cn(
              "mr-auto flex gap-3 items-center",
              classNames?.headersLabel && classNames.headersLabel[i]
            )}
          >
            <h4>{h.label}</h4>
            {h.desc && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground " />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{h.desc}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ))}
      </div>
      {content.map((c, index) => (
        <div
          key={index}
          className={cn(
            "grid gap-2 px-6 py-2 even:bg-gray-100 odd:bg-gray-200",
            index === headers.length - 1 && "rounded-b-sm",
            `grid-cols-${headers.length}`,
            classNames?.content
          )}
        >
          {c.map((prop, i) => (
            <span
              key={i}
              className={cn(
                "mr-auto flex items-center gap-4",
                classNames?.contentLabel && classNames.contentLabel[i]
              )}
            >
              <span>{prop.label}</span>
              {prop.desc && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{prop.desc}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;
