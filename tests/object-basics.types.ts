import { invert } from "../registry/functions/invert";
import { filterObject } from "../registry/functions/filterObject";
import { mapObject } from "../registry/functions/mapObject";
import { omit } from "../registry/functions/omit";
import { pick } from "../registry/functions/pick";
import {
  renameKeys,
  type RenameMapping,
} from "../registry/functions/renameKeys";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;
type Expect<Value extends true> = Value;

const omitted = omit({ id: 1, label: "ready" } as const, ["id"]);
type OmitContract = Expect<
  Equal<typeof omitted, { readonly label: "ready" }>
>;

// @ts-expect-error arrays are not plain-object inputs
omit([1, 2], [0]);
// @ts-expect-error known non-plain built-ins are rejected statically
omit(new Date(), []);
// @ts-expect-error functions are not plain-object inputs
omit(() => 1, []);
class KnownClass {}
// @ts-expect-error class constructors are not plain-object inputs
omit(KnownClass, []);

// @ts-expect-error known non-plain built-ins are rejected statically
pick(new Map<string, number>(), ["size"]);
// @ts-expect-error Promise-like values are not plain-object inputs
pick(Promise.resolve(1), ["then"]);

declare const selectedKeys: Array<"a" | "b">;
const dynamicallyPicked = pick({ a: 1, b: "x" }, selectedKeys);
const maybePickedA: number | undefined = dynamicallyPicked.a;
const maybePickedB: string | undefined = dynamicallyPicked.b;
// @ts-expect-error a dynamic key list may omit `a`
const requiredDynamicallyPickedA: number = dynamicallyPicked.a;
// @ts-expect-error a dynamic key list may omit `b`
const requiredDynamicallyPickedB: string = dynamicallyPicked.b;

const exactlyPicked = pick(
  { a: 1, b: "x", c: true } as const,
  ["a", "b"] as const
);
const exactPickedA: 1 = exactlyPicked.a;
const exactPickedB: "x" = exactlyPicked.b;
// @ts-expect-error an unselected key is absent
exactlyPicked.c;

declare const selectedUnionKey: "a" | "b";
const unionPicked = pick(
  { a: 1, b: "x" } as const,
  [selectedUnionKey] as const
);
const maybeUnionPickedA: 1 | undefined = unionPicked.a;
const maybeUnionPickedB: "x" | undefined = unionPicked.b;

// @ts-expect-error typed arrays are not plain-object inputs
renameKeys(new Uint8Array(), []);
// @ts-expect-error regular expressions are not plain-object inputs
renameKeys(/value/, []);

declare const optionalKey: { value?: "ready" };
invert(optionalKey);

declare const explicitlyUndefinedOptionalKey: {
  value?: "ready" | undefined;
};
// @ts-expect-error a present undefined value is not a property key
invert(explicitlyUndefinedOptionalKey);

filterObject({ 1: "one" } as const, (_value, key) => {
  const runtimeKey: "1" = key;
  return runtimeKey === "1";
});

mapObject({ 1: "one" } as const, (_value, key) => {
  const runtimeKey: "1" = key;
  return runtimeKey;
});

declare const objectPrototypeMember: { toString: () => string };
const inheritedRename = renameKeys(objectPrototypeMember, [
  { from: "toString", to: "stringify" },
]);
const maybeInheritedRename: (() => string) | undefined =
  inheritedRename.stringify;

type DynamicSource = { a: number };
declare const dynamicMappings: RenameMapping<DynamicSource>[];
const dynamicRename = renameKeys({ a: 1 }, dynamicMappings);
const dynamicSourceValue: number | undefined = dynamicRename.a;
const dynamicDestinationValue: unknown = dynamicRename.anyDestination;
// @ts-expect-error a dynamic mapping list may remove the source key
const requiredDynamicSource: number = dynamicRename.a;

declare const broadMapping: RenameMapping<DynamicSource>;
const broadTupleRename = renameKeys(
  { a: 1 },
  [broadMapping] as const
);
const broadTupleDestination: unknown = broadTupleRename.anyDestination;
const broadTupleSource: number | undefined = broadTupleRename.a;

declare const unionDestination: "x" | "y";
const unionDestinationRename = renameKeys(
  { a: 1 } as const,
  [{ from: "a", to: unionDestination }] as const
);
const possibleX: 1 | undefined = unionDestinationRename.x;
const possibleY: 1 | undefined = unionDestinationRename.y;
// @ts-expect-error only one member of a union destination is written
const requiredX: 1 = unionDestinationRename.x;

declare const unionSource: "required" | "optional";
declare const unionSourceInput: {
  required: number;
  optional?: string;
};
const unionSourceRename = renameKeys(
  unionSourceInput,
  [{ from: unionSource, to: "value" }] as const
);
const possibleUnionValue: number | string | undefined =
  unionSourceRename.value;
const possibleRetainedRequired: number | undefined =
  unionSourceRename.required;
// @ts-expect-error a union source may remove the required member
const requiredRetainedSource: number = unionSourceRename.required;

const literalDestinationRename = renameKeys(
  { a: 1 } as const,
  [{ from: "a", to: "renamed" }] as const
);
const literalDestinationValue: 1 = literalDestinationRename.renamed;

declare const uniqueDestination: unique symbol;
const uniqueDestinationRename = renameKeys(
  { a: 1 } as const,
  [{ from: "a", to: uniqueDestination }] as const
);
const uniqueDestinationValue: 1 =
  uniqueDestinationRename[uniqueDestination];

declare const patternedDestination: `item-${number}`;
const patternedDestinationRename = renameKeys(
  { a: 1 } as const,
  [{ from: "a", to: patternedDestination }] as const
);
const maybePatternedSource: 1 | undefined =
  patternedDestinationRename.a;
// @ts-expect-error a template pattern does not identify one runtime destination
const requiredPatternedDestination: 1 =
  patternedDestinationRename[patternedDestination];

declare const brandedDestination: string & {
  readonly destination: unique symbol;
};
const brandedDestinationRename = renameKeys(
  { a: 1 } as const,
  [{ from: "a", to: brandedDestination }] as const
);
const maybeBrandedSource: 1 | undefined = brandedDestinationRename.a;
// @ts-expect-error a branded string does not identify one runtime destination
const requiredBrandedDestination: 1 =
  brandedDestinationRename[brandedDestination];

declare const brandedSymbolDestination: symbol & {
  readonly destination: unique symbol;
};
const brandedSymbolDestinationRename = renameKeys(
  { a: 1 } as const,
  [{ from: "a", to: brandedSymbolDestination }] as const
);
const maybeBrandedSymbolSource: 1 | undefined =
  brandedSymbolDestinationRename.a;
// @ts-expect-error a branded symbol does not identify one runtime destination
const requiredBrandedSymbolDestination: 1 =
  brandedSymbolDestinationRename[brandedSymbolDestination];

void [
  maybePickedA,
  maybePickedB,
  requiredDynamicallyPickedA,
  requiredDynamicallyPickedB,
  exactPickedA,
  exactPickedB,
  maybeUnionPickedA,
  maybeUnionPickedB,
  maybeInheritedRename,
  dynamicSourceValue,
  dynamicDestinationValue,
  requiredDynamicSource,
  broadTupleDestination,
  broadTupleSource,
  possibleX,
  possibleY,
  requiredX,
  possibleUnionValue,
  possibleRetainedRequired,
  requiredRetainedSource,
  literalDestinationValue,
  uniqueDestinationValue,
  maybePatternedSource,
  requiredPatternedDestination,
  maybeBrandedSource,
  requiredBrandedDestination,
  maybeBrandedSymbolSource,
  requiredBrandedSymbolDestination,
];
