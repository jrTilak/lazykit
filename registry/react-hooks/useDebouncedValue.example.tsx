import { useState } from "react";

import { useDebouncedValue } from "./useDebouncedValue";

export const SearchPreview = () => {
  const [query, setQuery] = useState("");
  const settledQuery = useDebouncedValue(query, 300);

  return (
    <label>
      Search
      <input
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <span>Searching for: {settledQuery || "everything"}</span>
    </label>
  );
};
