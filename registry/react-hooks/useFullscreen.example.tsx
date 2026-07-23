import { useRef } from "react";

import { useFullscreen } from "./useFullscreen";

export const FullscreenExample = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { enter, exit, isFullscreen, isSupported } = useFullscreen(ref);

  return (
    <div ref={ref}>
      <p>{isFullscreen ? "Fullscreen" : "Windowed"}</p>
      <button
        type="button"
        disabled={!isSupported}
        onClick={() => void (isFullscreen ? exit() : enter())}
      >
        Toggle fullscreen
      </button>
    </div>
  );
};
