type UnsafeSegment = "" | "__proto__" | "prototype" | "constructor";
type KnownNonPlainObject =
  | readonly unknown[]
  | Date
  | RegExp
  | Error
  | PromiseLike<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | ((...arguments_: never[]) => unknown);
type KeyOf<T> = Extract<keyof T, string | number>;
type StringKey<Key extends PropertyKey> = Key extends string | number ? `${Key}` : never;
type PathsOf<T> = StringKey<KeyOf<T>>;
type IsOptional<T, Key extends keyof T> = {} extends Pick<T, Key> ? true : false;

type IsValidPath<Path extends string> =
  Path extends `${infer Head}.${infer Tail}`
    ? Head extends UnsafeSegment
      ? false
      : IsValidPath<Tail>
    : Path extends UnsafeSegment
      ? false
      : true;

type InvalidPathFlags<Paths extends string> =
  Paths extends Paths ? (IsValidPath<Paths> extends true ? false : true) : never;

type ConflictFlags<Paths extends string, AllPaths extends string = Paths> =
  Paths extends Paths
    ? Extract<AllPaths, `${Paths}.${string}`> extends never
      ? false
      : true
    : never;

type ValidateUnflattenKeys<T extends object> =
  string extends keyof T
    ? true
    : number extends keyof T
      ? true
      : Extract<keyof T, symbol> extends never
        ? true extends InvalidPathFlags<PathsOf<T>>
          ? false
          : true extends ConflictFlags<PathsOf<T>>
            ? false
            : true
        : false;

type OptionalFlags<T extends object> = {
  [Key in KeyOf<T>]-?: IsOptional<T, Key>;
}[KeyOf<T>];

type FirstSegment<Path extends string> =
  Path extends `${infer Head}.${string}` ? Head : Path;

type ChildSegments<Paths extends string, Prefix extends string> =
  Paths extends Paths
    ? Prefix extends ""
      ? FirstSegment<Paths>
      : Paths extends `${Prefix}.${infer Rest}`
        ? FirstSegment<Rest>
        : never
    : never;

type Join<Prefix extends string, Segment extends string> =
  Prefix extends "" ? Segment : `${Prefix}.${Segment}`;

type ValueAtPath<T extends object, Path extends string> = {
  [Key in KeyOf<T>]: StringKey<Key> extends Path ? T[Key] : never;
}[KeyOf<T>];

type BuildNestedObject<
  T extends object,
  Paths extends string,
  Prefix extends string = "",
  Depth extends readonly unknown[] = [],
> =
  Depth["length"] extends 16
    ? Record<string, unknown>
    : {
        [Segment in ChildSegments<Paths, Prefix>]:
          Join<Prefix, Segment> extends infer Path extends string
            ? Path extends Paths
              ? ValueAtPath<T, Path>
              : BuildNestedObject<T, Paths, Path, [...Depth, unknown]>
            : never;
      };

/** The nested object produced from a dot-path mapping. */
export type UnflattenObjectResult<T extends object> =
  string extends keyof T
    ? Record<string, unknown>
    : number extends keyof T
      ? Record<string, unknown>
      : Extract<keyof T, symbol> extends never
        ? true extends OptionalFlags<T>
          ? Record<string, unknown>
          : true extends InvalidPathFlags<PathsOf<T>>
            ? Record<string, unknown>
            : true extends ConflictFlags<PathsOf<T>>
              ? Record<string, unknown>
              : BuildNestedObject<T, PathsOf<T>>
        : Record<string, unknown>;

type PathNode = {
  children: Map<string, PathNode>;
  terminal: boolean;
};

const blocked = new Set(["__proto__", "prototype", "constructor"]);

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

type OwnPropertySnapshot = readonly [
  key: PropertyKey,
  descriptor: PropertyDescriptor,
];

const snapshotOwnProperties = (value: object): OwnPropertySnapshot[] => {
  const descriptors = Object.getOwnPropertyDescriptors(value);
  return Reflect.ownKeys(descriptors).map((key) => [
    key,
    Reflect.get(descriptors, key) as PropertyDescriptor,
  ]);
};

const readSnapshot = (
  receiver: object,
  descriptor: PropertyDescriptor,
): unknown =>
  "value" in descriptor ? descriptor.value : descriptor.get?.call(receiver);

const makePathNode = (): PathNode => ({
  children: new Map(),
  terminal: false,
});

/** Expands dot-delimited keys into nested plain objects. */
export const unflattenObject = <const T extends object>(
  object: T
    & (T extends KnownNonPlainObject ? never : unknown)
    & (ValidateUnflattenKeys<T> extends true ? unknown : never)
): UnflattenObjectResult<T> => {
  if (!isPlainObject(object)) {
    throw new TypeError("object must be a plain object");
  }
  const properties = snapshotOwnProperties(object);
  if (properties.some(([key]) => typeof key === "symbol")) {
    throw new TypeError("object contains an unsupported symbol key");
  }

  const pathProperties = properties.filter(
    (property): property is readonly [string, PropertyDescriptor] =>
      typeof property[0] === "string"
  );
  const pathTree = makePathNode();

  for (const [path] of pathProperties) {
    const segments = path.split(".");
    if (segments.some((segment) => segment === "" || blocked.has(segment))) {
      throw new TypeError("path contains an empty or unsafe segment");
    }

    let node = pathTree;
    for (const segment of segments) {
      if (node.terminal) {
        throw new TypeError(`path conflicts with an existing value: ${path}`);
      }

      const child = node.children.get(segment) ?? makePathNode();
      node.children.set(segment, child);
      node = child;
    }

    if (node.children.size > 0 || node.terminal) {
      throw new TypeError(`path conflicts with an existing value: ${path}`);
    }
    node.terminal = true;
  }

  const entries = pathProperties.map(
    ([path, descriptor]) => [path, readSnapshot(object, descriptor)] as const
  );
  const result: Record<string, unknown> = {};
  for (const [path, value] of entries) {
    const segments = path.split(".");
    let target = result;

    segments.forEach((segment, index) => {
      if (index === segments.length - 1) {
        Object.defineProperty(target, segment, {
          value,
          enumerable: true,
          configurable: true,
          writable: true,
        });
        return;
      }

      if (!Object.prototype.hasOwnProperty.call(target, segment)) {
        Object.defineProperty(target, segment, {
          value: {},
          enumerable: true,
          configurable: true,
          writable: true,
        });
      }
      target = target[segment] as Record<string, unknown>;
    });
  }

  return result as UnflattenObjectResult<T>;
};
