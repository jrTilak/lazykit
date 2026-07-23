import { useState } from "react";

import { useBeforeUnload } from "./useBeforeUnload";

export const UnsavedDraft = () => {
  const [draft, setDraft] = useState("");
  const [savedDraft, setSavedDraft] = useState("");
  useBeforeUnload(draft !== savedDraft);

  return (
    <section>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.currentTarget.value)}
      />
      <button type="button" onClick={() => setSavedDraft(draft)}>
        Save
      </button>
    </section>
  );
};
