"use client"
import React from 'react';
import useCounter from '.';
import { Button } from '@/components/ui/button';

export const CounterComponent = () => {
  const { count, increment, decrement, reset } = useCounter(0, { min: 0, max: 10 });

  return (
    <div className="flex flex-col gap-2 w-fit">
      <h1>Counter: <span className='text-destructive'>{count}</span></h1>
      <div className='flex gap-2.5 flex-wrap'>
        <Button variant={"secondary"} onClick={increment}>Increment +</Button>
        <Button variant={"secondary"} onClick={decrement}>Decrement -</Button>
        <Button variant={"secondary"} onClick={reset}>Reset</Button>
      </div>
    </div>
  );
};
