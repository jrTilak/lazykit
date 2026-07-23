export type TimeoutFunction<
  Arguments extends unknown[],
  Return,
  This = unknown,
> = (
  this: This,
  ...args: Arguments
) => Promise<Awaited<Return>>;

type AnyFunction = (
  this: never,
  ...args: never[]
) => unknown;

type ExtractedCall = {
  receiver: unknown;
  arguments: unknown[];
  return: unknown;
};

type LastTenCalls<Function extends AnyFunction> =
  Function extends {
    (this: infer Receiver1, ...args: infer Arguments1): infer Return1;
    (this: infer Receiver2, ...args: infer Arguments2): infer Return2;
    (this: infer Receiver3, ...args: infer Arguments3): infer Return3;
    (this: infer Receiver4, ...args: infer Arguments4): infer Return4;
    (this: infer Receiver5, ...args: infer Arguments5): infer Return5;
    (this: infer Receiver6, ...args: infer Arguments6): infer Return6;
    (this: infer Receiver7, ...args: infer Arguments7): infer Return7;
    (this: infer Receiver8, ...args: infer Arguments8): infer Return8;
    (this: infer Receiver9, ...args: infer Arguments9): infer Return9;
    (this: infer Receiver10, ...args: infer Arguments10): infer Return10;
  }
    ?
        | {
            receiver: Receiver1;
            arguments: Arguments1;
            return: Return1;
          }
        | {
            receiver: Receiver2;
            arguments: Arguments2;
            return: Return2;
          }
        | {
            receiver: Receiver3;
            arguments: Arguments3;
            return: Return3;
          }
        | {
            receiver: Receiver4;
            arguments: Arguments4;
            return: Return4;
          }
        | {
            receiver: Receiver5;
            arguments: Arguments5;
            return: Return5;
          }
        | {
            receiver: Receiver6;
            arguments: Arguments6;
            return: Return6;
          }
        | {
            receiver: Receiver7;
            arguments: Arguments7;
            return: Return7;
          }
        | {
            receiver: Receiver8;
            arguments: Arguments8;
            return: Return8;
          }
        | {
            receiver: Receiver9;
            arguments: Arguments9;
            return: Return9;
          }
        | {
            receiver: Receiver10;
            arguments: Arguments10;
            return: Return10;
          }
    : {
        receiver: ThisParameterType<Function>;
        arguments: Parameters<Function>;
        return: ReturnType<Function>;
      };

type AsyncifyCall<Call extends ExtractedCall> =
  Call extends ExtractedCall
    ? (
        this: Call["receiver"],
        ...args: Call["arguments"]
      ) => Promise<Awaited<Call["return"]>>
    : never;

type UnionToIntersection<Union> =
  (
    Union extends unknown
      ? (value: Union) => void
      : never
  ) extends (value: infer Intersection) => void
    ? Intersection
    : never;

/** The safe async call surface and own callable properties retained by `withTimeout`. */
export type TimeoutCallable<Function extends AnyFunction> =
  UnionToIntersection<AsyncifyCall<LastTenCalls<Function>>> &
    Pick<Function, keyof Function>;

export type TimeoutErrorFactory<Function extends AnyFunction> = (
  this: LastTenCalls<Function>["receiver"],
  ...args: LastTenCalls<Function>["arguments"]
) => Error;

/**
 * Wraps a function and rejects when waiting for its result takes too long.
 * Up to the final ten overloads are exposed as native-Promise signatures.
 */
export function withTimeout<Function extends AnyFunction>(
  fn: Function,
  timeoutMs: number,
  createError?: TimeoutErrorFactory<Function>
): TimeoutCallable<Function>;
export function withTimeout<This, Arguments extends unknown[], Return>(
  fn: (this: This, ...args: Arguments) => Return,
  timeoutMs: number,
  createError: (this: This, ...args: Arguments) => Error = () =>
    new Error(`Operation timed out after ${timeoutMs}ms`)
): TimeoutFunction<Arguments, Return, This> {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new RangeError("timeoutMs must be a finite, non-negative number");
  }

  return new Proxy(fn, {
    apply(target, receiver, args) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const deadline = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          try {
            reject(Reflect.apply(createError, receiver, args));
          } catch (error) {
            reject(error);
          }
        }, timeoutMs);
      });

      const operation = Promise.resolve().then(() =>
        Reflect.apply(target, receiver, args)
      ) as Promise<Awaited<Return>>;
      return Promise.race([operation, deadline]).finally(() => {
        if (timer !== undefined) clearTimeout(timer);
      });
    },
  }) as TimeoutFunction<Arguments, Return, This>;
}
