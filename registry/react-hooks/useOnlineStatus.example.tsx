import { useOnlineStatus } from "./useOnlineStatus";

export const OnlineStatusExample = () => {
  const isOnline = useOnlineStatus();
  return <p role="status">{isOnline ? "Online" : "Offline"}</p>;
};
