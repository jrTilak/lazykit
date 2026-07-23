import { useClipboard } from "./useClipboard";

export const CopyButton = () => {
  const clipboard = useClipboard();

  return (
    <button
      type="button"
      disabled={!clipboard.isSupported}
      onClick={() => void clipboard.copy("hello@example.com")}
    >
      {clipboard.state.status === "success" ? "Copied" : "Copy email"}
    </button>
  );
};
