import { useElementSize } from "./useElementSize";

export const ElementSizeExample = () => {
  const { ref, width, height } = useElementSize<HTMLDivElement>();

  return (
    <div ref={ref} style={{ resize: "both", overflow: "auto" }}>
      Element: {Math.round(width)} × {Math.round(height)}
    </div>
  );
};
