"use client"
import { useRef } from 'react';
import useRequestFullScreen from '.';
import { Button } from '@/components/ui/button';

const FullScreenComponent = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isFullScreen, requestFullScreen, exitFullScreen } = useRequestFullScreen(elementRef);

  return (
    <div
      ref={elementRef}
      className='flex flex-col items-center justify-center gap-2.5 p-6 h-fit bg-muted'>
      <span className={isFullScreen ? "text-destructive" : "text-foreground"}>{isFullScreen ? "In Fullscreen Mode" : "Not in Fullscreen Mode"}</span>
      <Button variant={"outline"} size={"sm"} onClick={requestFullScreen}>Enter Full Screen</Button>
      <Button variant={"outline"} size={"sm"} onClick={exitFullScreen}>Exit Full Screen</Button>
    </div>
  );
};

export default FullScreenComponent