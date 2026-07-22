'use client'

import { sleep } from "../../../functions/sleep";
import { useAsyncEffect } from '.';

export const MyComponent = () => {
  useAsyncEffect(async () => {
    await sleep(1000);
  }, []);

  return <div>Nothing to preview - see code instead!</div>;
};
