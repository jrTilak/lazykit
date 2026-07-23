import { useState } from "react";

import { useMutationObserver } from "./useMutationObserver";

export const MutationObserverExample = () => {
  const [items, setItems] = useState<string[]>([]);
  const [mutations, setMutations] = useState(0);
  const { ref } = useMutationObserver<HTMLUListElement>(
    (records) => setMutations((count) => count + records.length),
    { childList: true },
  );

  return (
    <div>
      <button type="button" onClick={() => setItems((list) => [...list, "Item"])}>
        Add item
      </button>
      <p>Observed mutations: {mutations}</p>
      <ul ref={ref}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
    </div>
  );
};
