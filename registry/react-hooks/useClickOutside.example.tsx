import { useRef, useState } from "react";

import { useClickOutside } from "./useClickOutside";

export const ClickOutsideExample = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  useClickOutside(panelRef, () => setOpen(false), { enabled: open });

  return (
    <div ref={panelRef}>
      <button type="button" onClick={() => setOpen(true)}>Open</button>
      {open && <p>Click outside this panel to close it.</p>}
    </div>
  );
};
