type CacheNode = {
  primitive: Map<unknown, CacheNode>;
  object: WeakMap<object, CacheNode>;
  hasValue: boolean;
  value?: unknown;
};

type Memoized<Arguments extends unknown[], Return> = ((...args: Arguments) => Return) & {
  clear: () => void;
};

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

/** Memoizes successful results using every argument as a cache key. */
export const memoize = <Arguments extends unknown[], Return>(
  fn: (...args: Arguments) => Return
): Memoized<Arguments, Return> => {
  let root = createNode();
  const memoized = (...args: Arguments): Return => {
    let node = root;
    for (const argument of args) node = childFor(node, argument);
    if (node.hasValue) return node.value as Return;
    const value = fn(...args);
    node.value = value;
    node.hasValue = true;
    return value;
  };
  return Object.assign(memoized, { clear: () => { root = createNode(); } });
};
