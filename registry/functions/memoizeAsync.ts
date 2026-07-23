type CacheNode = {
  primitive: Map<unknown, CacheNode>;
  object: WeakMap<object, CacheNode>;
  promise?: Promise<unknown>;
};

type MemoizedAsync<Arguments extends unknown[], Return> = ((...args: Arguments) => Promise<Awaited<Return>>) & {
  clear: () => void;
};

const createNode = (): CacheNode => ({ primitive: new Map(), object: new WeakMap() });
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

/** Memoizes asynchronous work and shares in-flight promises for equal arguments. */
export const memoizeAsync = <Arguments extends unknown[], Return>(
  fn: (...args: Arguments) => Return | PromiseLike<Return>,
  { cacheRejected = false }: { cacheRejected?: boolean } = {}
): MemoizedAsync<Arguments, Return> => {
  let root = createNode();
  const memoized = (...args: Arguments): Promise<Awaited<Return>> => {
    let node = root;
    for (const argument of args) node = childFor(node, argument);
    if (node.promise) return node.promise as Promise<Awaited<Return>>;
    const promise = Promise.resolve().then(() => fn(...args)) as Promise<Awaited<Return>>;
    node.promise = promise;
    if (!cacheRejected) promise.catch(() => { if (node.promise === promise) node.promise = undefined; });
    return promise;
  };
  return Object.assign(memoized, { clear: () => { root = createNode(); } });
};
