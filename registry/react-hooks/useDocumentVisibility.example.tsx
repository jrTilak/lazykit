import { useDocumentVisibility } from "./useDocumentVisibility";

export const DocumentVisibilityExample = () => {
  const visibility = useDocumentVisibility();
  return <p>Document is {visibility}.</p>;
};
