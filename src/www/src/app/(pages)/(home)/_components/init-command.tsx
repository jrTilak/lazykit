"use client";
import { toast } from "@/components/ui/use-toast";

const InitCommand = () => {
  const handleClick = () => {
    try {
      navigator.clipboard.writeText("npx @jrtilak/lazykit@latest init");
      toast({
        description: "Command copied to clipboard 🚀",
      });
    } catch (err) {
      toast({
        description: "Failed to copy command 😢",
        variant: "destructive",
      });
    }
  };
  return (
    <div
      onClick={handleClick}
      className="bg-muted text-muted-foreground px-8 py-3 rounded-lg cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
    >
      <span className="text-muted-foreground">$</span>
      <span className="text-primary dark:text-purple-400">npx</span>
      <span className="text-gray-800 dark:text-gray-300">
        @jrtilak/lazykit@latest
      </span>
      <span className="text-pink-800 dark:text-pink-200">init</span>
    </div>
  );
};
export default InitCommand;
