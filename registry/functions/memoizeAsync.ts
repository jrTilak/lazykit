type CacheNode = {
  primitive: Map<unknown, CacheNode>;
  object: WeakMap<object, CacheNode>;
  promise: Promise<unknown> | undefined;
};

export type MemoizedAsyncFunction<
  Arguments extends unknown[],
  Return,
  This = unknown,
> = ((
  this: This,
  ...args: Arguments
) => Promise<Awaited<Return>>) & MemoizeAsyncControls;

export type MemoizeAsyncControls = {
  readonly clear: () => void;
};

export type MemoizeAsyncOptions = {
  cacheRejected?: boolean;
};

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

type MemoizeAsyncOptionsFor<Function extends AnyFunction> =
  "clear" extends keyof Function ? never : [options?: MemoizeAsyncOptions];

/** The safe async call surface and own callable properties retained by `memoizeAsync`. */
export type MemoizedAsyncCallable<Function extends AnyFunction> =
  UnionToIntersection<AsyncifyCall<LastTenCalls<Function>>> &
    Pick<Function, keyof Function> &
    MemoizeAsyncControls;

const createNode = (): CacheNode => ({
  primitive: new Map(),
  object: new WeakMap(),
  promise: undefined,
});
const childFor = (node: CacheNode, key: unknown): CacheNode => {
  const isObject =
    (typeof key === "object" && key !== null) || typeof key === "function";
  const cache = isObject ? node.object : node.primitive;
  let child = cache.get(key as never);
  if (!child) {
    child = createNode();
    cache.set(key as never, child);
  }
  return child;
};

/**
 * Memoizes asynchronous work and shares in-flight promises for equal arguments.
 * Up to the final ten overloads are exposed as native-Promise signatures.
 */
export function memoizeAsync<Function extends AnyFunction>(
  fn: Function,
  ...options: MemoizeAsyncOptionsFor<Function>
): MemoizedAsyncCallable<Function>;
export function memoizeAsync<This, Arguments extends unknown[], Return>(
  fn: (this: This, ...args: Arguments) => Return,
  { cacheRejected = false }: MemoizeAsyncOptions = {}
): MemoizedAsyncFunction<Arguments, Return, This> {
  if ("clear" in fn) {
    throw new TypeError('fn must not define a "clear" property');
  }

  let root = createNode();

  const clear = () => {
    root = createNode();
  };

  return new Proxy(fn, {
    apply(target, receiver, args) {
      let node = childFor(root, receiver);
      for (const argument of args) node = childFor(node, argument);
      if (node.promise) return node.promise;

      const promise = Promise.resolve().then(() =>
        Reflect.apply(target, receiver, args)
      ) as Promise<Awaited<Return>>;
      node.promise = promise;
      if (!cacheRejected) {
        promise.catch(() => {
          if (node.promise === promise) node.promise = undefined;
        });
      }
      return promise;
    },
    get(target, property, receiver) {
      return property === "clear"
        ? clear
        : Reflect.get(target, property, receiver);
    },
    has(target, property) {
      return property === "clear" || Reflect.has(target, property);
    },
    set(target, property, value, receiver) {
      return property === "clear"
        ? false
        : Reflect.set(target, property, value, receiver);
    },
  }) as unknown as MemoizedAsyncFunction<Arguments, Return, This>;
}
