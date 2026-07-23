import {
  createEventEmitter,
  type EventEmissionArguments,
  type EventEmitter,
} from "../registry/functions/createEventEmitter";
import { debounce } from "../registry/functions/debounce";
import { mapConcurrent } from "../registry/functions/mapConcurrent";
import { memoize } from "../registry/functions/memoize";
import {
  memoizeAsync,
  type MemoizedAsyncFunction,
} from "../registry/functions/memoizeAsync";
import { once } from "../registry/functions/once";
import { pLimit } from "../registry/functions/pLimit";
import { pipe } from "../registry/functions/pipe";
import { poll } from "../registry/functions/poll";
import { retry } from "../registry/functions/retry";
import { throttle } from "../registry/functions/throttle";
import {
  tryCatch,
  type TryCatchResult,
} from "../registry/functions/tryCatch";
import { withCallCount } from "../registry/functions/withCallCount";
import { withTimeout } from "../registry/functions/withTimeout";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;
type Expect<Value extends true> = Value;

type Events = {
  ready: { id: number };
  progress: number;
};
const emitter: EventEmitter<Events> = createEventEmitter<Events>();
emitter.on("ready", (event) => event.id);
emitter.emit("progress", 50);
declare const emission: EventEmissionArguments<Events>;
emitter.emit(...emission);
// @ts-expect-error event payloads stay correlated with their keys
emitter.emit("ready", 50);
// @ts-expect-error listeners are invoked without a receiver
emitter.on("progress", function (this: { factor: number }, value) {
  return this.factor * value;
});

type Counter = { value: number };
declare const counter: Counter;
const debouncedMethod = debounce(function (this: Counter, amount: number) {
  this.value += amount;
});
debouncedMethod.call(counter, 1);
// @ts-expect-error a receiver-dependent callback produces a receiver-dependent wrapper
debouncedMethod(1);

const concurrent = mapConcurrent([1, 2], 2, async (value) => String(value));
type ConcurrentContract = Expect<Equal<typeof concurrent, Promise<string[]>>>;
// @ts-expect-error transforms are invoked without a receiver
mapConcurrent([1], 1, function (this: Counter, value) {
  return this.value + value;
});

const genericMemoized = memoize(<Value>(value: Value) => value);
const memoizedLiteral = genericMemoized({ ready: true } as const);
type MemoizedGenericContract = Expect<
  Equal<typeof memoizedLiteral, { readonly ready: true }>
>;
const memoizedMethod = memoize(function (this: Counter, amount: number) {
  return this.value + amount;
});
const memoizedMethodResult: number = memoizedMethod.call(counter, 1);
// @ts-expect-error the original method receiver is preserved
memoizedMethod(1);

const memoizedAsync: MemoizedAsyncFunction<[number], string> = memoizeAsync(
  async (value: number) => String(value)
);
const memoizedAsyncResult: Promise<string> = memoizedAsync(1);
const memoizedAsyncMethod = memoizeAsync(function (
  this: Counter,
  amount: number
) {
  return this.value + amount;
});
memoizedAsyncMethod.call(counter, 1);
// @ts-expect-error the async wrapper preserves the callback receiver
memoizedAsyncMethod(1);

const genericOnce = once(<Value>(value: Value) => value);
const onceValue: unknown = genericOnce("ready" as const);
// @ts-expect-error a first-call cache cannot safely preserve an argument-dependent return type
const onceLiteral: "ready" = genericOnce("ready" as const);
const onceMethod = once(function (this: Counter) {
  return this.value;
});
onceMethod.call(counter);
// @ts-expect-error the original method receiver is preserved
onceMethod();

const limit = pLimit(2);
const limited: Promise<number> = limit(async () => 1);
// @ts-expect-error limited tasks are invoked without a receiver
limit(function (this: Counter) {
  return this.value;
});

const piped = pipe(
  1,
  (value) => value + 1,
  String,
  (value) => value.length
);
type PipeContract = Expect<Equal<typeof piped, number>>;
// @ts-expect-error pipe stages are invoked without a receiver
pipe(1, function (this: Counter, value) {
  return this.value + value;
});

const polled = poll(async (attempt) => attempt, {
  until: (value) => value === 2,
});
type PollContract = Expect<Equal<typeof polled, Promise<number>>>;
// @ts-expect-error the predicate cannot change the operation's resolved type
poll(() => 1, { until: (value: string) => value.length > 0 });
// @ts-expect-error poll operations are invoked without a receiver
poll(function (this: Counter) {
  return this.value;
}, { until: Boolean });

const retried = retry(async (attempt) => attempt);
type RetryContract = Expect<Equal<typeof retried, Promise<number>>>;
// @ts-expect-error retry operations are invoked without a receiver
retry(function (this: Counter) {
  return this.value;
});

const throttledMethod = throttle(function (
  this: Counter,
  amount: number
) {
  return this.value + amount;
}, 100);
const throttledResult: number | undefined = throttledMethod.call(counter, 1);
// @ts-expect-error the throttled wrapper preserves the callback receiver
throttledMethod(1);

const syncResult: TryCatchResult<number> = tryCatch(() => 1);
const asyncResult: Promise<TryCatchResult<number>> = tryCatch(async () => 1);
const objectResult = tryCatch(() => ({ ready: true }));
type ObjectTryCatchContract = Expect<
  Equal<
    typeof objectResult,
    | TryCatchResult<{ ready: boolean }>
    | Promise<TryCatchResult<unknown>>
  >
>;
declare const unknownOperation: (this: void) => unknown;
const unknownResult = tryCatch(unknownOperation);
type UnknownTryCatchContract = Expect<
  Equal<
    typeof unknownResult,
    TryCatchResult<unknown> | Promise<TryCatchResult<unknown>>
  >
>;
declare const voidOperation: (this: void) => void;
const voidResult = tryCatch(voidOperation);
type VoidTryCatchContract = Expect<
  Equal<
    typeof voidResult,
    TryCatchResult<unknown> | Promise<TryCatchResult<unknown>>
  >
>;
declare const broadNonNullishOperation: (this: void) => {};
const broadNonNullishResult = tryCatch(broadNonNullishOperation);
type BroadNonNullishTryCatchContract = Expect<
  Equal<
    typeof broadNonNullishResult,
    TryCatchResult<{}> | Promise<TryCatchResult<unknown>>
  >
>;
// @ts-expect-error tryCatch invokes its operation without a receiver
tryCatch(function (this: Counter) {
  return this.value;
});

const genericCounted = withCallCount(<Value>(value: Value) => value);
const countedLiteral = genericCounted(1 as const);
type CountedGenericContract = Expect<Equal<typeof countedLiteral, 1>>;
const countedMethod = withCallCount(function (this: Counter) {
  return this.value;
});
countedMethod.call(counter);
// @ts-expect-error the counted wrapper preserves the callback receiver
countedMethod();

const timedMethod = withTimeout(function (
  this: Counter,
  amount: number
) {
  return Promise.resolve(this.value + amount);
}, 100);
const timedResult: Promise<number> = timedMethod.call(counter, 1);
// @ts-expect-error the timeout wrapper preserves the callback receiver
timedMethod(1);

void [
  memoizedMethodResult,
  memoizedAsyncResult,
  limited,
  throttledResult,
  onceValue,
  syncResult,
  asyncResult,
  objectResult,
  unknownResult,
  voidResult,
  broadNonNullishResult,
  timedResult,
];
