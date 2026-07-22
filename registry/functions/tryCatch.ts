export type TryCatchResult<Value> =
  | [error: Error, value: undefined]
  | [error: undefined, value: Value];

type TryCatchReturn<Return> = [Return] extends [never]
  ? TryCatchResult<never>
  : Return extends PromiseLike<unknown>
    ? Promise<TryCatchResult<Awaited<Return>>>
    : TryCatchResult<Return>;

const toError = (reason: unknown): Error => {
  if (reason instanceof Error) return reason;
  return new Error("Operation failed", { cause: reason });
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> => {
  return (
    ((typeof value === "object" && value !== null) ||
      typeof value === "function") &&
    typeof (value as { then?: unknown }).then === "function"
  );
};

/** Executes synchronous or asynchronous work as an error-first result tuple. */
export const tryCatch = <Return>(
  operation: () => Return
): TryCatchReturn<Return> => {
  try {
    const value = operation();

    if (isPromiseLike(value)) {
      return Promise.resolve(value).then(
        (resolved) => [undefined, resolved],
        (reason) => [toError(reason), undefined]
      ) as TryCatchReturn<Return>;
    }

    return [undefined, value] as TryCatchReturn<Return>;
  } catch (reason) {
    return [toError(reason), undefined] as TryCatchReturn<Return>;
  }
};
