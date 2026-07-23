import { memoizeAsync } from "../registry/functions/memoizeAsync";
import { withTimeout } from "../registry/functions/withTimeout";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;
type Expect<Value extends true> = Value;

const genericMemoized = memoizeAsync(Object.assign(
  <Value>(value: Value) => Promise.resolve(value),
  { label: "identity" as const }
)
);
const memoizedLiteral = genericMemoized({ ready: true } as const);
type MemoizedGenericContract = Expect<
  Equal<typeof memoizedLiteral, Promise<unknown>>
>;
const memoizedLabel: "identity" = genericMemoized.label;
genericMemoized.clear();

const genericTimed = withTimeout(
  Object.assign(
    <Value>(value: Value) => Promise.resolve(value),
    { label: "identity" as const }
  ),
  100
);
const timedLiteral = genericTimed(["ready"] as const);
type TimedGenericContract = Expect<
  Equal<typeof timedLiteral, Promise<unknown>>
>;
const timedLabel: "identity" = genericTimed.label;

type BrandedPromise<Value> = Promise<Value> & { readonly brand: unique symbol };
declare const brandedOperation: (value: number) => BrandedPromise<number>;

const memoizedBranded = memoizeAsync(brandedOperation);
const memoizedBrandedResult: Promise<number> = memoizedBranded(1);
// @ts-expect-error memoizeAsync returns a native Promise, not custom Promise fields
memoizedBranded(1).brand;

const timedBranded = withTimeout(brandedOperation, 100);
const timedBrandedResult: Promise<number> = timedBranded(1);
// @ts-expect-error withTimeout returns a native Promise, not custom Promise fields
timedBranded(1).brand;

type CustomThenable<Value> = PromiseLike<Value> & { readonly pending: boolean };
declare const thenableOperation: (value: number) => CustomThenable<number>;
const memoizedThenable = memoizeAsync(thenableOperation);
const memoizedThenableResult: Promise<number> = memoizedThenable(1);
// @ts-expect-error custom thenable fields do not survive native Promise assimilation
memoizedThenable(1).pending;
const timedThenable = withTimeout(thenableOperation, 100);
const timedThenableResult: Promise<number> = timedThenable(1);
// @ts-expect-error the timeout race returns a native Promise
timedThenable(1).pending;

void [
  memoizedBrandedResult,
  timedBrandedResult,
  memoizedThenableResult,
  timedThenableResult,
];

type LastFiveReturns<Function> =
  Function extends {
    (...args: infer _Arguments1): infer Return1;
    (...args: infer _Arguments2): infer Return2;
    (...args: infer _Arguments3): infer Return3;
    (...args: infer _Arguments4): infer Return4;
    (...args: infer _Arguments5): infer Return5;
  }
    ? Return1 | Return2 | Return3 | Return4 | Return5
    : never;

interface MixedOperation {
  (value: string): string;
  (value: number): Promise<number>;
}

type MixedReturnsContract = Expect<
  Equal<LastFiveReturns<MixedOperation>, string | Promise<number>>
>;
type GenericReturnsContract = Expect<
  Equal<
    LastFiveReturns<<Value>(value: Value) => Promise<Value>>,
    Promise<unknown>
  >
>;

declare const mixedOperation: MixedOperation;
const mixedMemoized = memoizeAsync(mixedOperation);
const mixedMemoizedAsyncResult: Promise<number> = mixedMemoized(1);
const mixedMemoizedSyncResult: Promise<string> = mixedMemoized("value");

const mixedTimed = withTimeout(mixedOperation, 100);
const mixedTimedAsyncResult: Promise<number> = mixedTimed(1);
const mixedTimedSyncResult: Promise<string> = mixedTimed("value");
withTimeout(
  mixedOperation,
  100,
  (value: string | number) => new Error(String(value))
);
// @ts-expect-error the factory must handle every exposed overload
withTimeout(mixedOperation, 100, (value: number) => new Error(String(value)));

interface AsyncOverloads {
  (value: string): Promise<string>;
  (value: number): Promise<number>;
}
declare const asyncOverloads: AsyncOverloads;
const memoizedOverloads = memoizeAsync(asyncOverloads);
const memoizedString: Promise<string> = memoizedOverloads("value");
const timedOverloads = withTimeout(asyncOverloads, 100);
const timedNumber: Promise<number> = timedOverloads(1);

interface ElevenOverloads {
  (value: "sync"): string;
  (value: 1): Promise<1>;
  (value: 2): Promise<2>;
  (value: 3): Promise<3>;
  (value: 4): Promise<4>;
  (value: 5): Promise<5>;
  (value: 6): Promise<6>;
  (value: 7): Promise<7>;
  (value: 8): Promise<8>;
  (value: 9): Promise<9>;
  (value: 10): Promise<10>;
}
declare const elevenOverloads: ElevenOverloads;
const memoizedEleven = memoizeAsync(elevenOverloads);
const memoizedTenth: Promise<10> = memoizedEleven(10);
// @ts-expect-error only the final ten overloads are exposed
memoizedEleven("sync");
const timedEleven = withTimeout(elevenOverloads, 100);
const timedTenth: Promise<10> = timedEleven(10);
// @ts-expect-error only the final ten overloads are exposed
timedEleven("sync");

declare const clearCollision: (<Value>(value: Value) => Promise<Value>) & {
  clear?: () => void;
};
// @ts-expect-error memoizeAsync reserves clear for its cache control
memoizeAsync(clearCollision);

void [
  memoizedLabel,
  timedLabel,
  mixedMemoizedAsyncResult,
  mixedMemoizedSyncResult,
  mixedTimedAsyncResult,
  mixedTimedSyncResult,
  memoizedString,
  timedNumber,
  memoizedTenth,
  timedTenth,
];
