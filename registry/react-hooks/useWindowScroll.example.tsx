import { useWindowScroll } from "./useWindowScroll";

export const WindowScrollExample = () => {
  const { x, y, scrollTo } = useWindowScroll();
  return (
    <p>
      Scroll: {Math.round(x)}, {Math.round(y)}{" "}
      <button type="button" onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>
        Back to top
      </button>
    </p>
  );
};
