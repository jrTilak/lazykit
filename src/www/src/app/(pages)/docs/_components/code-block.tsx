"use client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Check, Files, LucideIcon, WrapText, X } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ICodeBlock {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: ICodeBlock) => {
  const [wrapLines, setWrapLines] = useState(false);
  const [isCopying, setIsCopying] = useState({
    isCopying: false,
    Icon: Files,
  });
  const { toast } = useToast();
  const handleCopy = () => {
    setIsCopying((prev) => ({ ...prev, isCopying: true }));
    try {
      navigator.clipboard.writeText(code);
      setIsCopying((prev) => ({ ...prev, Icon: Check }));
      toast({
        description: "Code copied to clipboard 🚀",
      });
    } catch (err) {
      setIsCopying((prev) => ({ ...prev, Icon: X }));
      toast({
        description: "Failed to copy code 😢",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsCopying(() => ({ isCopying: false, Icon: Files }));
      }, 2000);
    }
  };
  return (
    <div className="relative max-h-[80vh] overflow-y-scroll">
      <div className="absolute top-4 right-4 text-neutral-300 z-40 flex gap-1 flex-col items-center justify-center">
        <button
          disabled={isCopying.isCopying}
          onClick={handleCopy}
          className="hover:bg-neutral-600 p-1 rounded-md transition-colors"
        >
          <isCopying.Icon className="h-5 w-5" />
        </button>
        <button
          onClick={() => setWrapLines((prev) => !prev)}
          className={cn(
            "hover:bg-neutral-600 p-1 rounded-md transition-colors",
            wrapLines ? "opacity-100" : "opacity-80"
          )}
        >
          <WrapText className="h-5 w-5" />
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        customStyle={{
          borderRadius: "0.25rem",
          paddingRight: "4rem",
        }}
        style={vscDarkPlus}
        codeTagProps={{
          style: {
            fontSize: "1rem",
          },
        }}
        wrapLongLines={wrapLines}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
export default CodeBlock;
