"use client"
import React from 'react';
import useBoolean from '.';
import { Button } from '@/components/ui/button';

const ToggleComponent = () => {
  const { value, setValue, setTrue, setFalse, toggle } = useBoolean(false);

  return (
    <div className='flex flex-col gap-4'>
      <p>The current state is: <span className='text-destructive'>{String(value)}</span></p>

      <div className='flex gap-4'>
        <Button variant={"secondary"} onClick={setTrue}>Set True</Button>
        <Button variant={"secondary"} onClick={setFalse}>Set False</Button>
        <Button variant={"secondary"} onClick={toggle}>Toggle</Button>
      </div>

      {/* Demonstrating direct state manipulation */}
      <div className='flex gap-4'>
        <Button variant={"secondary"} onClick={() => setValue(true)}>Directly Set True</Button>
        <Button variant={"secondary"} onClick={() => setValue(false)}>Directly Set False</Button>
      </div>
    </div>
  );
};

export default ToggleComponent;