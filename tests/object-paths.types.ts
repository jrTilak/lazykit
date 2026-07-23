import { compactObject } from "../registry/functions/compactObject";
import { getPath } from "../registry/functions/getPath";
import { hasPath } from "../registry/functions/hasPath";
import { mergeDeep } from "../registry/functions/mergeDeep";
import { renameKeys } from "../registry/functions/renameKeys";
import { setPath } from "../registry/functions/setPath";
import { unsetPath } from "../registry/functions/unsetPath";
import { updatePath } from "../registry/functions/updatePath";

declare const symbolKey: unique symbol;
declare const model: {
  user?: { name: string; token: string };
  list: string[];
  tuple: readonly ["first", 2];
  7: { enabled: boolean };
  [symbolKey]: number;
};

const optionalName: string | undefined = getPath(model, "user.name");
const nameWithDefault: string = getPath(model, "user.name", "anonymous");
// @ts-expect-error selecting a fallback type does not make the argument optional
getPath<typeof model, "user.name", string>(model, "user.name");
// @ts-expect-error the supplied fallback must match its explicit generic
getPath<typeof model, "user.name", string>(model, "user.name", undefined);
const listItem: string | undefined = getPath(model, "list.0");
const listFallback: string = getPath(model, ["list", 100], "missing");
const tupleFirst: "first" = getPath(model, ["tuple", 0]);
const numericKey: boolean = getPath(model, "7.enabled");
const symbolValue: number = getPath(model, [symbolKey]);
const root: typeof model = getPath(model, "");

declare const broadIndex: number;
const broadItem: unknown = getPath(model.list, [broadIndex]);
declare const dynamicString: string;
declare const dynamicSegments: PropertyKey[];
const dynamicValue: unknown = getPath(model, dynamicString);
const dynamicTupleValue: unknown = getPath(model, dynamicSegments);
declare const unionKey: "user" | "list";
const unionRead: unknown = getPath(model, [unionKey]);
// @ts-expect-error union-segment reads are intentionally conservative
const assumedUnionRead: object = getPath(model, [unionKey]);
hasPath(model, [unionKey]);

declare const pathStringBrand: unique symbol;
declare const pathNumberBrand: unique symbol;
declare const pathSymbolBrand: unique symbol;
type BrandedPathString = string & {
  readonly [pathStringBrand]: true;
};
type BrandedPathNumber = number & {
  readonly [pathNumberBrand]: true;
};
type BrandedPathSymbol = symbol & {
  readonly [pathSymbolBrand]: true;
};
declare const brandedPathString: BrandedPathString;
declare const brandedPathNumber: BrandedPathNumber;
declare const brandedPathSymbol: BrandedPathSymbol;
declare const templatePathKey: `field-${string}`;
declare const unionLengthPath:
  | readonly ["first"]
  | readonly ["nested", "value"];
declare const optionalElementPath: readonly [key?: "first"];
declare const pathProbe: {
  first: number;
  nested: { value: string };
  0: boolean;
};

const brandedStringRead: unknown = getPath(pathProbe, [brandedPathString]);
const directBrandedRead: unknown = getPath(pathProbe, brandedPathString);
const brandedNumberRead: unknown = getPath(pathProbe, [brandedPathNumber]);
const brandedSymbolRead: unknown = getPath(pathProbe, [brandedPathSymbol]);
const templateRead: unknown = getPath(pathProbe, [templatePathKey]);
const unionLengthRead: unknown = getPath(pathProbe, unionLengthPath);
// @ts-expect-error branded keys do not identify one statically known property
const assumedBrandedRead: number = getPath(pathProbe, [brandedPathString]);
// @ts-expect-error template-pattern keys can name more than one property
const assumedTemplateRead: number = getPath(pathProbe, [templatePathKey]);
// @ts-expect-error a branded symbol is not one unique symbol value
const assumedBrandedSymbolRead: boolean = getPath(pathProbe, [
  brandedPathSymbol,
]);
// @ts-expect-error paths with multiple possible tuple lengths are dynamic
const assumedUnionLengthRead: number = getPath(pathProbe, unionLengthPath);
// @ts-expect-error an optional element may be undefined and is not an ObjectPath
getPath(pathProbe, optionalElementPath);
hasPath(pathProbe, [brandedPathString]);
hasPath(pathProbe, [brandedPathNumber]);
hasPath(pathProbe, [brandedPathSymbol]);
hasPath(pathProbe, [templatePathKey]);
hasPath(pathProbe, unionLengthPath);

declare const arrayMetadataKey: unique symbol;
declare const arrayWithOwnMetadata: number[] & {
  label: string;
  [arrayMetadataKey]: boolean;
  "4294967295": "ordinary-property";
};
const arrayLabel: string = getPath(arrayWithOwnMetadata, "label");
const arrayMetadataValue: boolean = getPath(arrayWithOwnMetadata, [
  arrayMetadataKey,
]);
const lastArrayItem: number | undefined = getPath(
  arrayWithOwnMetadata,
  "4294967294"
);
const numericLikeProperty: "ordinary-property" = getPath(
  arrayWithOwnMetadata,
  "4294967295"
);
hasPath(arrayWithOwnMetadata, "label");
hasPath(arrayWithOwnMetadata, [arrayMetadataKey]);
hasPath(arrayWithOwnMetadata, "4294967295");

declare const tupleWithMetadata: readonly [1, 2] & { label: "tuple" };
const tupleLabel: "tuple" = getPath(tupleWithMetadata, "label");
hasPath(tupleWithMetadata, "label");

// @ts-expect-error numeric-like properties above 2^32-2 need an explicit key
getPath([] as number[], "4294967295");
// @ts-expect-error inherited Array methods are not own-property paths
getPath(arrayWithOwnMetadata, "map");
// @ts-expect-error inherited Array methods are not own-property paths
hasPath(arrayWithOwnMetadata, "push");
// @ts-expect-error Date methods live on Date.prototype
getPath(new Date(), "getTime");
// @ts-expect-error Map accessors live on Map.prototype
hasPath(new Map<string, number>(), "size");
declare const labeledDate: Date & { label: string };
const labeledDateValue: string = getPath(labeledDate, "label");
hasPath(labeledDate, "label");

// @ts-expect-error invalid literal object keys are rejected
getPath(model, "user.missing");
// @ts-expect-error tuple bounds are checked
getPath(model, ["tuple", 2]);
// @ts-expect-error invalid literal paths are rejected by hasPath too
hasPath(model, "missing.value");
hasPath(model, dynamicString);

const replaced = setPath({ count: 1 }, "count", "one");
const replacedCount: string = replaced.count;
// @ts-expect-error setPath does not retain the replaced value's old type
const staleSetCount: number = replaced.count;

const created = setPath({}, "users.0.name", "Ada");
const createdName: string = created.users[0]!.name;
const broadSetResult: object = setPath({}, ["items", broadIndex], true);
declare const unionMutationKey: "first" | "second";
const unionSetResult = setPath({}, [unionMutationKey], 1);
// @ts-expect-error a union segment does not guarantee either property
unionSetResult.first;
declare const broadMutationKey: string;
const broadSetTupleResult = setPath({}, [broadMutationKey], 1);
// @ts-expect-error a broad fixed-tuple segment returns conservative object
broadSetTupleResult.value;
const brandedSetResult = setPath(
  { first: 1 },
  [brandedPathString],
  "updated"
);
// @ts-expect-error a branded key may overwrite any runtime property
brandedSetResult.first;
const templateSetResult = setPath(
  { first: 1 },
  [templatePathKey],
  "updated"
);
// @ts-expect-error a template-pattern key cannot promise retained properties
templateSetResult.first;
const unionLengthSetResult = setPath(pathProbe, unionLengthPath, true);
// @ts-expect-error a union-length path cannot promise a particular mutation
unionLengthSetResult.first;
const maximumSet = setPath({}, ["items", 4_294_967_294], "last");
const maximumSetValue: string | undefined =
  maximumSet.items[4_294_967_294];
const propertySet = setPath({}, ["items", 4_294_967_295], "property");
const propertySetValue: string = propertySet.items[4_294_967_295];
// @ts-expect-error empty mutation paths always throw
setPath({}, "", true);
// @ts-expect-error empty segment tuples always throw
setPath({}, [], true);
// @ts-expect-error array length is not a mutable data-property path
setPath({ items: [1] }, "items.length", 0);
// @ts-expect-error root-array length is rejected too
setPath([1], ["length"], 0);
// @ts-expect-error known non-plain built-ins are invalid roots
setPath(new Date(), "value", true);
// @ts-expect-error functions are invalid mutation roots
setPath(() => 1, "value", true);
// @ts-expect-error literal traversal through a known atomic value always throws
setPath({ date: new Date() }, "date.value", true);
const replacedDate = setPath({ date: new Date() }, "date", "replaced");
const replacedDateValue: string = replacedDate.date;

const updated = updatePath({ count: 1 }, "count", (current) => {
  const typedCurrent: number = current;
  return String(typedCurrent);
});
const updatedCount: string = updated.count;
const broadUpdateResult: object = updatePath(
  {},
  ["items", broadIndex],
  () => true
);
const brandedUpdateResult = updatePath(
  { first: 1 },
  [brandedPathString],
  (current) => {
    const dynamicCurrent: unknown = current;
    // @ts-expect-error a branded key does not identify the current value type
    const assumedCurrent: number = current;
    void [dynamicCurrent, assumedCurrent];
    return true;
  }
);
// @ts-expect-error a branded update cannot promise retained properties
brandedUpdateResult.first;
const unionLengthUpdateResult = updatePath(
  pathProbe,
  unionLengthPath,
  (current) => {
    const dynamicCurrent: unknown = current;
    // @ts-expect-error possible tuple lengths resolve conservatively
    const assumedCurrent: number = current;
    void [dynamicCurrent, assumedCurrent];
    return true;
  }
);
// @ts-expect-error a union-length update has a conservative result
unionLengthUpdateResult.first;
const unionUpdateResult = updatePath(
  { first: 1, second: "two" },
  [unionMutationKey],
  (current) => {
    // @ts-expect-error union-segment updater values are conservative unknown
    const assumedNumber: number = current;
    void assumedNumber;
    return true;
  }
);
// @ts-expect-error neither union-selected property is statically guaranteed
unionUpdateResult.first;
const maximumUpdate = updatePath(
  {},
  ["items", 4_294_967_294],
  () => "last"
);
const maximumUpdateValue: string | undefined =
  maximumUpdate.items[4_294_967_294];
const propertyUpdate = updatePath(
  {},
  ["items", 4_294_967_295],
  () => "property"
);
const propertyUpdateValue: string = propertyUpdate.items[4_294_967_295];
// @ts-expect-error empty update paths always throw
updatePath({}, "", () => true);
// @ts-expect-error array length cannot be updated
updatePath({ items: [1] }, ["items", "length"], () => 0);
updatePath(
  { value: 1 },
  "value",
// @ts-expect-error update callbacks are invoked without a `this` receiver
  function (this: { multiplier: number }, value) {
    return value * this.multiplier;
  }
);
// @ts-expect-error Map is a known non-plain root
updatePath(new Map<string, number>(), "value", () => true);
// @ts-expect-error literal traversal through Promise always throws
updatePath({ promise: Promise.resolve(1) }, "promise.value", () => true);
const replacedPromise = updatePath(
  { promise: Promise.resolve(1) },
  "promise",
  () => "replaced"
);
const replacedPromiseValue: string = replacedPromise.promise;

const withoutToken = unsetPath(
  { user: { name: "Ada", token: "secret" } },
  "user.token"
);
const remainingName: string = withoutToken.user.name;
// @ts-expect-error unsetPath removes the target from its return type
withoutToken.user.token;

declare const optionalAncestor: { user?: { token: string } };
const optionalUnset = unsetPath(optionalAncestor, "user.token");
const optionalUser: {} | undefined = optionalUnset.user;
const unionUnsetResult = unsetPath(
  { first: 1, second: 2 },
  [unionMutationKey]
);
// @ts-expect-error a union path cannot promise which key was removed
unionUnsetResult.first;
const broadUnsetResult = unsetPath({ value: 1 }, [broadMutationKey]);
// @ts-expect-error a broad path may remove any key
broadUnsetResult.value;
const brandedUnsetResult = unsetPath(
  { first: 1 },
  [brandedPathString]
);
// @ts-expect-error a branded key may remove any runtime property
brandedUnsetResult.first;
const templateUnsetResult = unsetPath({ first: 1 }, [templatePathKey]);
// @ts-expect-error a template-pattern key may remove the declared key
templateUnsetResult.first;
const unionLengthUnsetResult = unsetPath(pathProbe, unionLengthPath);
// @ts-expect-error a union-length path cannot promise which property was removed
unionLengthUnsetResult.first;
// @ts-expect-error empty unset paths always throw
unsetPath({}, []);
// @ts-expect-error an array's non-configurable length cannot be removed
unsetPath({ items: [1] }, "items.length");
// @ts-expect-error Set is a known non-plain root
unsetPath(new Set<number>(), "value");
// @ts-expect-error literal traversal through RegExp always throws
unsetPath({ pattern: /x/ }, "pattern.source");
const withoutPattern = unsetPath({ pattern: /x/, keep: true }, "pattern");
const keptAfterAtomicRemoval: boolean = withoutPattern.keep;

class RuntimeCheckedContainer {
  value = 1;
}
// Custom classes cannot be distinguished structurally and retain runtime checks.
setPath(new RuntimeCheckedContainer(), "value", 2);
updatePath(new RuntimeCheckedContainer(), "value", () => 2);
unsetPath(new RuntimeCheckedContainer(), "value");

const compacted = compactObject({
  removed: null,
  maybe: null as string | null,
  nested: { kept: 1, removed: undefined },
});
const maybeCompacted: string | undefined = compacted.maybe;
const compactedValue: number = compacted.nested.kept;
// @ts-expect-error nullish-only properties are removed
compacted.removed;
// @ts-expect-error recursively nullish-only properties are removed
compacted.nested.removed;

declare const metadata: unique symbol;
declare const arrayWithMetadata: Array<number | null> & {
  label?: string;
  [metadata]: { value: number | null };
};
const compactedArray = compactObject(arrayWithMetadata);
const compactedItem: number | undefined = compactedArray[0];
const compactedLabel: string | undefined = compactedArray.label;
const compactedMetadata: { value?: number } = compactedArray[metadata];

interface BaseConfig {
  server: { host: string; port: number };
  enabled: boolean;
}
interface OverrideConfig {
  server: { port: string };
}
declare const baseConfig: BaseConfig;
declare const overrideConfig: OverrideConfig;
const merged = mergeDeep(baseConfig, overrideConfig);
const mergedPort: string = merged.server.port;
// Interfaces cannot prove a plain-object runtime prototype, so base-only fields
// are intentionally unavailable on the conservative replacement-or-merge union.
// @ts-expect-error the override replacement branch has no host
merged.server.host;
// @ts-expect-error the override replacement branch has no enabled flag
merged.enabled;

declare const optionalOverride: { enabled?: "automatic" };
const optionalMerged = mergeDeep({ enabled: true }, optionalOverride);
const optionalMergedValue: boolean | "automatic" | undefined =
  optionalMerged.enabled;

class Box {
  value = 1;
}
const classBase = mergeDeep(new Box(), { enabled: true });
const classBaseEnabled: boolean = classBase.enabled;
// @ts-expect-error replacement can remove fields from the base class
classBase.value;

const classOverride = mergeDeep({ enabled: true }, new Box());
const classOverrideValue: number = classOverride.value;
// @ts-expect-error a class override can replace the entire base object
classOverride.enabled;

const renamed = renameKeys(
  { text: "value", count: 1 },
  [{ from: "text", to: "count" }]
);
const renamedCount: string = renamed.count;
// @ts-expect-error destination types are replaced rather than intersected
const staleRenamedCount: number = renamed.count;

void [
  optionalName,
  nameWithDefault,
  listItem,
  listFallback,
  tupleFirst,
  numericKey,
  symbolValue,
  root,
  broadItem,
  dynamicValue,
  dynamicTupleValue,
  unionRead,
  brandedStringRead,
  directBrandedRead,
  brandedNumberRead,
  brandedSymbolRead,
  assumedBrandedSymbolRead,
  templateRead,
  unionLengthRead,
  assumedBrandedRead,
  assumedTemplateRead,
  assumedUnionLengthRead,
  arrayLabel,
  arrayMetadataValue,
  lastArrayItem,
  numericLikeProperty,
  tupleLabel,
  labeledDateValue,
  replacedCount,
  staleSetCount,
  createdName,
  broadSetResult,
  unionSetResult,
  broadSetTupleResult,
  brandedSetResult,
  templateSetResult,
  unionLengthSetResult,
  replacedDateValue,
  maximumSetValue,
  propertySetValue,
  updatedCount,
  broadUpdateResult,
  brandedUpdateResult,
  unionLengthUpdateResult,
  unionUpdateResult,
  maximumUpdateValue,
  propertyUpdateValue,
  replacedPromiseValue,
  remainingName,
  optionalUser,
  unionUnsetResult,
  broadUnsetResult,
  brandedUnsetResult,
  templateUnsetResult,
  unionLengthUnsetResult,
  keptAfterAtomicRemoval,
  maybeCompacted,
  compactedValue,
  compactedItem,
  compactedLabel,
  compactedMetadata,
  mergedPort,
  optionalMergedValue,
  classBaseEnabled,
  classOverrideValue,
  renamedCount,
  staleRenamedCount,
];
