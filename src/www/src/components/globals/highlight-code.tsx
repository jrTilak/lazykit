"use client";
import React, { useState, useRef, useEffect } from "react";
import { Highlight, HighlightProps, themes } from "prism-react-renderer";
import { Button } from "../ui/button";
import {
  CheckCheckIcon,
  ClipboardCopyIcon,
  WrapTextIcon,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/helpers/cn";

type Props = Omit<HighlightProps, "theme" | "children" | "prism"> & {
  wrapButton?: boolean;
  hideLineNumbers?: boolean;
};

const HighlightCode = ({ hideLineNumbers = false, ...props }: Props) => {
  const [icon, setIcon] = useState(<ClipboardCopyIcon className="size-3.5" />);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [lineWrap, setLineWrap] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false); // Track overflow based on width
  const codeRef = useRef<HTMLPreElement | null>(null); // Reference to <pre> element

  const onCopy = () => {
    if (typeof window === "undefined" || !("localStorage" in window)) return;
    setIsBtnDisabled(true);
    try {
      window.navigator.clipboard.writeText(props.code);
      toast.success("Code copied to clipboard!");
      setIcon(<CheckCheckIcon className="size-3.5 text-green-500" />);
    } catch (err) {
      toast.error("Failed to copy code!");
      setIcon(<X className="size-3.5 text-destructive" />);
    } finally {
      setTimeout(() => {
        setIsBtnDisabled(false);
        setIcon(<ClipboardCopyIcon className="size-3.5" />);
      }, 2000);
    }
  };

  // Check for overflow after component mounts and whenever code changes
  useEffect(() => {
    const checkOverflow = () => {
      if (codeRef.current) {
        const { clientWidth, scrollWidth } = codeRef.current;
        setIsOverflow(scrollWidth > clientWidth); // Check for horizontal overflow
      }
    };

    checkOverflow(); // Initial check
    window.addEventListener("resize", checkOverflow); // Check on resize

    return () => {
      window.removeEventListener("resize", checkOverflow); // Cleanup
    };
  }, [props.code]);

  return (
    <div className="relative">
      <Button
        size={"sm"}
        variant={"secondary"}
        disabled={isBtnDisabled}
        onClick={onCopy}
        className="absolute top-2 right-2 h-fit w-fit aspect-square p-1 bg-muted max-h-full"
      >
        {icon}
      </Button>
      {/* Show wrap button only if there is a horizontal overflow */}
      {props.wrapButton && isOverflow && (
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={() => {
            setLineWrap((prev) => !prev);
          }}
          className="absolute top-9 right-2 h-fit w-fit aspect-square p-1 bg-muted max-h-full"
        >
          <WrapTextIcon className="size-3.5" />
        </Button>
      )}
      <Highlight theme={themes.palenight} {...props}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            ref={codeRef} // Attach ref to <pre>
            style={style}
            className={cn(
              "font-fira-code p-2 rounded-sm text-left tracking-normal overflow-x-auto text-[14px] my-4 pr-10",
              lineWrap ? "text-wrap" : "text-nowrap"
            )}
          >
            {tokens.map((line, i) => {
              const { className, ...props } = getLineProps({ line });
              return (
                <div key={i} className={cn("table-row", className)} {...props}>
                  {!hideLineNumbers && tokens.length > 1 && (
                    <span className="text-sm opacity-60 table-cell pr-3 text-right select-none">
                      {i + 1}.
                    </span>
                  )}
                  <div className="table-cell">
                    {line.map((token, key) => {
                      const { className, ...props } = getTokenProps({ token });
                      return (
                        <span key={key} className={cn(className)} {...props} />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default HighlightCode;
