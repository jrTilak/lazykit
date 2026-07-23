export type TryCatchResult<Value> =
  | [error: Error, value: undefined]
  | [error: undefined, value: Value];

type IsAny<Value> = 0 extends 1 & Value ? true : false;
type IsUnknown<Value> = IsAny<Value> extends true
  ? false
  : unknown extends Value
    ? keyof Value extends never
      ? true
      : false
    : false;
type UncertainTryCatchReturn<Return> =
  | TryCatchResult<Return>
  | Promise<TryCatchResult<unknown>>;

/**
 * Objects and unknown values retain an uncertain Promise branch because
 * JavaScript thenability is a runtime property that their static type may hide.
 */
export type TryCatchReturn<Return> =
  IsAny<Return> extends true
    ? UncertainTryCatchReturn<Return>
    : IsUnknown<Return> extends true
      ? UncertainTryCatchReturn<Return>
      : [void] extends [Return]
        ? UncertainTryCatchReturn<unknown>
        : object extends Return
          ? UncertainTryCatchReturn<Return>
          : [Return] extends [never]
            ? TryCatchResult<never>
            : Return extends PromiseLike<unknown>
              ? Promise<TryCatchResult<Awaited<Return>>>
              : Return extends object
                ? UncertainTryCatchReturn<Return>
                : TryCatchResult<Return>;

const toError = (reason: unknown): Error => {
  if (reason instanceof Error) return reason;
  return new Error("Operation failed", { cause: reason });
};

type Then = (
  this: object,
  onfulfilled: (value: unknown) => void,
  onrejected: (reason: unknown) => void
) => unknown;

type ThenInspection =
  | { status: "not-thenable" }
  | { status: "thenable"; receiver: object; then: Then }
  | { status: "threw"; reason: unknown };

const inspectThen = (value: unknown): ThenInspection => {
  if (
    (typeof value !== "object" || value === null) &&
    typeof value !== "function"
  ) {
    return { status: "not-thenable" };
  }

  try {
    const then = (value as { then?: unknown }).then;
    return typeof then === "function"
      ? { status: "thenable", receiver: value, then: then as Then }
      : { status: "not-thenable" };
  } catch (reason) {
    return { status: "threw", reason };
  }
};

const assimilate = (
  receiver: object,
  then: Then
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    queueMicrotask(() => {
      try {
        Reflect.apply(then, receiver, [
          (value: unknown) => {
            if (value === receiver) {
              reject(new TypeError("Thenable cannot resolve to itself"));
              return;
            }
            resolve(value);
          },
          reject,
        ]);
      } catch (reason) {
        reject(reason);
      }
    });
  });
};

/** Executes synchronous or asynchronous work as an error-first result tuple. */
export const tryCatch = <Return>(
  operation: (this: void) => Return
): TryCatchReturn<Return> => {
  try {
    const value = operation();
    const inspection = inspectThen(value);

    if (inspection.status === "thenable") {
      return assimilate(inspection.receiver, inspection.then).then(
        (resolved) => [undefined, resolved],
        (reason) => [toError(reason), undefined]
      ) as TryCatchReturn<Return>;
    }

    if (inspection.status === "threw") {
      return Promise.resolve([
        toError(inspection.reason),
        undefined,
      ]) as TryCatchReturn<Return>;
    }

    return [undefined, value] as TryCatchReturn<Return>;
  } catch (reason) {
    return [toError(reason), undefined] as TryCatchReturn<Return>;
  }
};
