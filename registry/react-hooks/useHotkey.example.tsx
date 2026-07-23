import { useState } from "react";

import { useHotkey } from "./useHotkey";

export const HotkeyExample = () => {
  const [saved, setSaved] = useState(0);
  useHotkey("mod+s", () => setSaved((count) => count + 1));

  return <p>Press Ctrl/Command + S. Saved {saved} times.</p>;
};
