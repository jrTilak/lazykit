import { useRef, useState } from "react";

import { useMergedRefs } from "./useMergedRefs";

export function MergedRefsExample() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mountedNode, setMountedNode] = useState<HTMLInputElement | null>(null);
  const mergedRef = useMergedRefs(inputRef, setMountedNode);

  return (
    <div>
      <input ref={mergedRef} defaultValue="Both refs receive this input" />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus input
      </button>
      <p>{mountedNode === null ? "Input is detached" : "Input is attached"}</p>
    </div>
  );
}
