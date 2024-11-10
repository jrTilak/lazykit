"use client"
import React from "react";
import useToggle from ".";
import { Button } from "@/components/ui/button";

const ToggleComponent = () => {
  // Toggling between "ON" and "OFF"
  const { state, toggle, setState } = useToggle("ON", "OFF");

  return (
    <div className="flex flex-col items-center justify-center gap-2.5 p-6">
      <h1 className="text-xl">Status: {state}</h1>
      <Button onClick={toggle} variant={'secondary'} size={"sm"}>Toggle</Button>
    </div>
  );
};

export default ToggleComponent;
