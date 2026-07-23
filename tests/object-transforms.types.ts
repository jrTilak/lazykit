import {
  flattenObject,
  type FlattenObjectResult,
} from "../registry/functions/flattenObject";
import {
  unflattenObject,
  type UnflattenObjectResult,
} from "../registry/functions/unflattenObject";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;

type Expect<Value extends true> = Value;

const flat = flattenObject({
  user: {
    name: "Ada",
    address: { postcode: 10101 },
  },
  active: true,
  tags: ["typescript", "bun"],
  createdAt: new Date(0),
  empty: {},
  7: "seven",
});

type _FlatLiteral = Expect<
  Equal<
    typeof flat,
    {
      "user.name": "Ada";
      "user.address.postcode": 10101;
      active: true;
      tags: readonly ["typescript", "bun"];
      createdAt: Date;
      empty: {};
      "7": "seven";
    }
  >
>;

type _FlatAlias = Expect<
  Equal<
    FlattenObjectResult<{
      account: { id: number; profile: { verified: boolean } };
    }>,
    {
      "account.id": number;
      "account.profile.verified": boolean;
    }
  >
>;

interface DeclaredOwnSource {
  hidden: { value: number };
  visible: string;
}

declare const sourceWithDeclaredNonEnumerableProperty: DeclaredOwnSource;
const flatDeclaredOwnSource = flattenObject(
  sourceWithDeclaredNonEnumerableProperty
);
type _FlatDeclaredNonEnumerableProperty = Expect<
  Equal<
    typeof flatDeclaredOwnSource,
    {
      "hidden.value": number;
      visible: string;
    }
  >
>;

interface Profile {
  user: {
    name: string;
    preferences: {
      compact: boolean;
    };
  };
  active: boolean;
}

declare const profile: Profile;
const flatProfile = flattenObject(profile);
type _FlatInterface = Expect<
  Equal<
    typeof flatProfile,
    {
      "user.name": string;
      "user.preferences.compact": boolean;
      active: boolean;
    }
  >
>;

class Box {
  readonly value = 1 as const;
}

const box = new Box();
const flatBox = flattenObject({ box });
type _FlatClassIsConservative = Expect<
  Equal<
    typeof flatBox,
    {
      box?: Box;
      "box.value"?: 1;
    }
  >
>;

interface DeclaredPreferences {
  compact: boolean;
}

interface ProfileWithDeclaredNestedInterface {
  preferences: DeclaredPreferences;
  id: string;
}

declare const profileWithDeclaredNestedInterface: ProfileWithDeclaredNestedInterface;
const flatDeclaredInterface = flattenObject(profileWithDeclaredNestedInterface);
type _FlatDeclaredNestedInterfaceIsConservative = Expect<
  Equal<
    typeof flatDeclaredInterface,
    {
      preferences?: DeclaredPreferences;
      "preferences.compact"?: boolean;
      id: string;
    }
  >
>;

declare const broadNestedRecord: Record<string, { value: number }>;
const broadFlat = flattenObject(broadNestedRecord);
type _BroadFlatFallback = Expect<
  Equal<typeof broadFlat, Record<string, unknown>>
>;

type OptionalNestedInput = {
  required: number;
  optional?: { value: string };
};
declare const optionalNestedInput: OptionalNestedInput;
const optionalFlat = flattenObject(optionalNestedInput);
type _OptionalFlatFallback = Expect<
  Equal<typeof optionalFlat, Record<string, unknown>>
>;

const nested = unflattenObject({
  "user.name": "Ada",
  "user.address.postcode": 10101,
  active: true,
  tags: ["typescript", "bun"],
  "7.label": "seven",
});

type _NestedLiteral = Expect<
  Equal<
    typeof nested,
    {
      user: {
        name: "Ada";
        address: { postcode: 10101 };
      };
      active: true;
      tags: readonly ["typescript", "bun"];
      "7": { label: "seven" };
    }
  >
>;

type _NestedAlias = Expect<
  Equal<
    UnflattenObjectResult<{
      "account.id": number;
      "account.profile.verified": boolean;
    }>,
    {
      account: {
        id: number;
        profile: { verified: boolean };
      };
    }
  >
>;

interface DeclaredFlatOwnSource {
  "hidden.value": number;
  visible: string;
}

declare const flatSourceWithDeclaredNonEnumerableProperty: DeclaredFlatOwnSource;
const nestedDeclaredOwnSource = unflattenObject(
  flatSourceWithDeclaredNonEnumerableProperty
);
type _NestedDeclaredNonEnumerableProperty = Expect<
  Equal<
    typeof nestedDeclaredOwnSource,
    {
      hidden: { value: number };
      visible: string;
    }
  >
>;

interface FlatProfile {
  "user.name": string;
  "user.preferences.compact": boolean;
  active: boolean;
}

declare const flatProfileInput: FlatProfile;
const nestedProfile = unflattenObject(flatProfileInput);
type _NestedInterface = Expect<
  Equal<
    typeof nestedProfile,
    {
      user: {
        name: string;
        preferences: { compact: boolean };
      };
      active: boolean;
    }
  >
>;

const settings = { theme: "dark" as const };
const nestedLeaf = unflattenObject({ settings });
type _NestedLeafIdentity = Expect<
  Equal<typeof nestedLeaf, { settings: { theme: "dark" } }>
>;

declare const broadFlatRecord: Record<string, number>;
const broadNested = unflattenObject(broadFlatRecord);
type _BroadNestedFallback = Expect<
  Equal<typeof broadNested, Record<string, unknown>>
>;

type _ConflictFallback = Expect<
  Equal<
    UnflattenObjectResult<{ a: number; "a.b": number }>,
    Record<string, unknown>
  >
>;

type _InvalidPathFallback = Expect<
  Equal<
    UnflattenObjectResult<{ "a..b": number }>,
    Record<string, unknown>
  >
>;

type OptionalFlatInput = {
  "user.name"?: string;
};
declare const optionalFlatInput: OptionalFlatInput;
const optionalNested = unflattenObject(optionalFlatInput);
type _OptionalNestedFallback = Expect<
  Equal<typeof optionalNested, Record<string, unknown>>
>;

// @ts-expect-error Arrays are not flat or nested plain-object mappings.
flattenObject([]);
// @ts-expect-error Dates are leaf values, not plain-object roots.
flattenObject(new Date());
// @ts-expect-error Arrays are not flat path mappings.
unflattenObject([]);
// @ts-expect-error Dates are not flat path mappings.
unflattenObject(new Date());

// @ts-expect-error Dot-containing source keys are ambiguous.
flattenObject({ "a.b": 1 });
// @ts-expect-error Unsafe source keys cannot become object paths.
flattenObject({ constructor: 1 });
// @ts-expect-error Computed __proto__ is an own unsafe source key.
flattenObject({ ["__proto__"]: 1 });
// @ts-expect-error Nested literal source keys are validated recursively.
flattenObject({ safe: { "not.safe": 1 } });

const ownSymbol = Symbol("own");
// @ts-expect-error Symbol keys cannot be represented by dot paths.
flattenObject({ [ownSymbol]: 1 });

// @ts-expect-error An empty path always fails at runtime.
unflattenObject({ "": 1 });
// @ts-expect-error Empty path segments always fail at runtime.
unflattenObject({ "a..b": 1 });
// @ts-expect-error Unsafe path segments always fail at runtime.
unflattenObject({ "a.constructor.value": 1 });
// @ts-expect-error __proto__ is unsafe in every path position.
unflattenObject({ "__proto__.value": 1 });
// @ts-expect-error A path cannot be both a leaf and a branch.
unflattenObject({ a: 1, "a.b": 2 });
// @ts-expect-error Symbol keys cannot be interpreted as paths.
unflattenObject({ [ownSymbol]: 1 });
