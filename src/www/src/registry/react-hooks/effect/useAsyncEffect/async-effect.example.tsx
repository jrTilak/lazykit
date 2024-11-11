'use client'

import sleep from '@/registry/functions/functional/sleep';
import useAsyncEffect from '.';

const MyComponent = () => {
  useAsyncEffect(async () => {
    await sleep(1000);
  }, []);

  return <div>Nothing to preview - see code instead!</div>;
};

export default MyComponent;