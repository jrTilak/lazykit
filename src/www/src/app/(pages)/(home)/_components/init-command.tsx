"use client";

import toast from "react-hot-toast";

const InitCommand = () => {
  const handleClick = () => {
    try {
      navigator.clipboard.writeText("npx @jrtilak/lazykit@latest init");
      toast.success("Command copied to clipboard 🚀")
    } catch (err) {
      toast.error("Failed to copy command 😢")
    }
  };
  return (
    <div
      onClick={handleClick}
      className="bg-muted text-muted-foreground px-8 py-3 font-fira-code rounded-lg cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
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
