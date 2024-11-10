import React, { useRef, useState } from 'react';
import useShortcutKey from '.';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const ShortcutExample = () => {
  const [message, setMessage] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);


  const { enable, disable, isEnabled } = useShortcutKey(buttonRef, {
    keys: ['Control', 'S'],
    preventDefault: true,
    autoEnable: true,
  });

  return (
    <div className='flex flex-col w-full h-full items-center justify-center gap-4'>
      <Button variant={"secondary"} size={"sm"} ref={buttonRef}
        onClick={() => {
          toast.success("Button is clicked")
        }}
      >Press `Ctrl + S`</Button>
      <p>{message}</p>
      <p>Shortcut listener is {isEnabled ? 'enabled' : 'disabled'}</p>
      <Button variant={"outline"} size={"sm"} onClick={enable}>Enable Shortcut</Button>
      <Button variant={"outline"} size={"sm"} onClick={disable}>Disable Shortcut</Button>
    </div>
  );
};

export default ShortcutExample;
