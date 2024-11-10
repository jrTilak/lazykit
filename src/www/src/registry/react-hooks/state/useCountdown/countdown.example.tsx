import React, { useState } from "react";
import useCountdown from ".";
import { Button } from "@/components/ui/button";

const CountdownComponent = () => {

  const {
    time,
    isCounting,
    controls: { start, pause, stop, reset },
  } = useCountdown(
    {
      from: 10,
      to: 0,
      dir: "dec",
      config: {
        changeBy: 1,
        interval: 1000,
        onChange: (newTime) => console.log("Time changed:", newTime),
        onStart: () => console.log("Countdown started!"),
        onEnd: () => console.log("Countdown ended!"),
        loop: true
      },
    }
  );

  return (
    <div className="flex items-center justify-center gap-4 p-6 flex-col">
      <h1 className="text-xl">Countdown: {time}</h1>
      <div
        className="flex items-center justify-center gap-2.5"
      >
        <Button variant={"secondary"} size={"sm"} onClick={start} disabled={isCounting}>
          Start
        </Button>
        <Button variant={"secondary"} size={"sm"} onClick={pause} disabled={!isCounting}>
          Pause
        </Button>
        <Button variant={"secondary"} size={"sm"} onClick={stop}>
          Stop
        </Button>
        <Button variant={"secondary"} size={"sm"} onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CountdownComponent;
