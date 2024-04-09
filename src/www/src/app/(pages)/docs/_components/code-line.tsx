"use client";
import { useToast } from "@/components/ui/use-toast";
import { Check, Files, X } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useLocalStorage from "use-local-storage";
interface ICodeLine {
  code: string;
  language: string;
  className?: string;
  showLangFlag?: boolean;
}

const CodeLine = ({
  code,
  language,
  className,
  showLangFlag = true,
}: ICodeLine) => {
  const [lang] = useLocalStorage("code-lang", "ts");
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
  const codeWithLangFlag = `${code} -${lang === "js" ? "js" : "ts"}`;
  return (
    <div className={`relative overflow-y-scroll ${className}`}>
      <button
        disabled={isCopying.isCopying}
        onClick={handleCopy}
        className="hover:bg-neutral-600 p-1 rounded-md transition-colors text-neutral-300 z-40 absolute right-4 top-1/2 -translate-y-1/2"
      >
        <isCopying.Icon className="h-5 w-5" />
      </button>

      <SyntaxHighlighter
        language={language}
        customStyle={{
          borderRadius: "0.25rem",
          padding: "1rem",
          width: "100%",
        }}
        style={vscDarkPlus}
        codeTagProps={{
          style: {
            fontSize: "1rem",
          },
        }}
      >
        {showLangFlag ? codeWithLangFlag : code}
      </SyntaxHighlighter>
    </div>
  );
};
export default CodeLine;
