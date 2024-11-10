import React from "react";
import useIsOnline from ".";

const NetworkStatus = () => {
  const isOnline = useIsOnline();

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center gap-2.5">
      <p>
        Try  {isOnline ? "disconnecting from" : "connecting to"} your internet connection.
      </p>
      <p className={isOnline ? "text-green-500" : "text-destructive"}>{isOnline ? "You are online!" : "You are offline!"}</p>
    </div>
  );
};

export default NetworkStatus;
