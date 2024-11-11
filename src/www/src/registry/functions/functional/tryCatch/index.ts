/**
 * Helps to safely execute synchronous functions
 **/
type TryCatchReturn<Err, Return> = [Err, undefined] | [undefined, Return];

const tryCatch = <Err extends Error, Return>(
  fn: () => Return
): TryCatchReturn<Err, Return> => {
  let data: Return | undefined = undefined;
  let err: Err | undefined = undefined;

  try {
    data = fn();
  } catch (error) {
    err = error as Err;
  }
  return [err, data] as TryCatchReturn<Err, Return>;
};

export default tryCatch;
