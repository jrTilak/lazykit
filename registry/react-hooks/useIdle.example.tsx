import { useIdle } from "./useIdle";

export const ActivityStatus = () => {
  const { isIdle } = useIdle(60_000);
  return <p>Status: {isIdle ? "Away" : "Active"}</p>;
};
