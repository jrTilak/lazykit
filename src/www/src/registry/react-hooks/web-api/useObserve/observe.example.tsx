"use client"
import React, { useRef } from 'react';
import useObserve from '.';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const ExampleComponent = () => {
  const ref = useRef<HTMLDivElement>(null);

  const {
    isIntersecting,
    enable,
    disable,
    isEnabled
  } = useObserve(ref, {
    once: true,
    autoEnable: true,
    threshold: 0.5, // Trigger when 50% of the element is in the viewport
    onIntersect: () => toast.success('Element is intersecting!'),
    onLeave: () => toast.error('Element has left the viewport!')
  });

  return (
    <div
      ref={ref}
      className='bg-muted flex items-center justify-center gap-2.5 h-full flex-col p-6'
    >
      <span
        className='text-center text-lg'
      >
        Element - {isIntersecting ? 'Visible' : 'Hidden'}
      </span>
      <Button onClick={enable} disabled={isEnabled}>Enable Observer</Button>
      <Button onClick={disable} disabled={!isEnabled}>Disable Observer</Button>
    </div>
  );
};

export default ExampleComponent;
