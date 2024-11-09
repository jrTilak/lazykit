import React, { useState, useRef, useEffect } from 'react';
import useClickAnywhere from '.';
import { Button } from '@/components/ui/button';

const ClickAnywhereComponent: React.FC = () => {
  const [clickTime, setClickTime] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [status, setStatus] = useState<string>('Disabled');
  const boxRef = useRef<HTMLDivElement>(null);

  // Callback function for handling the click event
  const handleClickAnywhere = (event: MouseEvent) => {
    setClickTime(new Date().toLocaleTimeString());
    setClickCount((prev) => prev + 1);
  };

  // Use the custom hook with autoEnable set to true
  const { enable, disable, isEnabled } = useClickAnywhere(handleClickAnywhere, false, [boxRef]);

  // Toggle the status message based on the `enabled` state
  useEffect(() => {
    setStatus(isEnabled ? 'Enabled' : 'Disabled');
  }, [isEnabled]);

  return (
    <div>
      <div
        ref={boxRef}
        className='py-4 px-6 bg-muted border border-muted-foreground rounded-lg mb-4'
      >
        <p>This is Box 1. Click outside to trigger the event!</p>
      </div>

      <p>Status: {status}</p>
      <p>Last clicked at: {clickTime ? clickTime : 'No clicks yet'}</p>
      <p>Total Clicks: {clickCount}</p>

      <div className='mt-4 flex items-center gap-4'>
        <Button variant={"outline"} size={"sm"} onClick={enable}>Enable Click Detection</Button>
        <Button variant={"outline"} size={"sm"} onClick={disable}>Disable Click Detection</Button>
      </div>
    </div>
  );
};

export default ClickAnywhereComponent;
