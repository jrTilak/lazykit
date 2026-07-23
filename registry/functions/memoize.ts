type CacheNode = {
  primitive: Map<unknown, CacheNode>;
  object: WeakMap<object, CacheNode>;
  hasValue: boolean;
  value?: unknown;
};

export type MemoizeControls = {
  readonly clear: () => void;
};

export type MemoizedFunction<
  Arguments extends unknown[],
  Return,
  This = unknown,
> = ((this: This, ...args: Arguments) => Return) & MemoizeControls;

type AnyFunction = (this: never, ...args: never[]) => unknown;
type MemoizeGuard<Function extends AnyFunction> =
  "clear" extends keyof Function ? never : [];

const createNode = (): CacheNode => ({
  primitive: new Map(),
  object: new WeakMap(),
  hasValue: false,
});

const childFor = (node: CacheNode, key: unknown): CacheNode => {
  const isObject = (typeof key === "object" && key !== null) || typeof key === "function";
  const cache = isObject ? node.object : node.primitive;
  let child = cache.get(key as never);
  if (!child) {
    child = createNode();
    cache.set(key as never, child);
  }
  return child;
};

/** Memoizes successful results using the receiver and every argument as cache keys. */
export const memoize = <Function extends AnyFunction>(
  fn: Function,
  ..._guard: MemoizeGuard<Function>
): Function & MemoizeControls => {
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
      if (node.hasValue) return node.value;

      const value = Reflect.apply(target, receiver, args);
      node.value = value;
      node.hasValue = true;
      return value;
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
  }) as Function & MemoizeControls;
};
