import { useHistoryState } from "./useHistoryState";

export function HistoryStateExample() {
  const editor = useHistoryState("", { maxHistory: 20 });

  return (
    <div>
      <textarea
        value={editor.state}
        onChange={(event) => editor.setState(event.currentTarget.value)}
      />
      <button type="button" onClick={editor.undo} disabled={!editor.canUndo}>
        Undo
      </button>
      <button type="button" onClick={editor.redo} disabled={!editor.canRedo}>
        Redo
      </button>
      <button type="button" onClick={editor.reset}>Reset</button>
    </div>
  );
}
