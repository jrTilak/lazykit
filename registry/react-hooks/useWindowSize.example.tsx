import { useWindowSize } from "./useWindowSize";

export const WindowSizeExample = () => {
  const { width, height } = useWindowSize();
  return <p>Viewport: {width} × {height}</p>;
};
