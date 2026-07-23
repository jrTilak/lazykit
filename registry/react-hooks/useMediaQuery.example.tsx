import { useMediaQuery } from "./useMediaQuery";

export const MediaQueryExample = () => {
  const isWide = useMediaQuery("(min-width: 48rem)");
  return <p>{isWide ? "Wide layout" : "Compact layout"}</p>;
};
