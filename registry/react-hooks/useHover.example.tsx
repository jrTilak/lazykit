import { useHover } from "./useHover";

export const HoverExample = () => {
  const { ref, isHovered } = useHover<HTMLDivElement>();

  return (
    <div ref={ref} tabIndex={0}>
      {isHovered ? "Pointer is inside" : "Hover this area"}
    </div>
  );
};
