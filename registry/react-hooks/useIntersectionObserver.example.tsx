import { useIntersectionObserver } from "./useIntersectionObserver";

export const IntersectionObserverExample = () => {
  const { ref, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({ threshold: 0.5 });

  return (
    <div ref={ref}>
      {isIntersecting ? "At least half visible" : "Scroll this element into view"}
    </div>
  );
};
