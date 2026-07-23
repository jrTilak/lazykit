import { chunk, type ChunkOptions } from "../registry/functions/chunk";
import { compact } from "../registry/functions/compact";
import {
  createEventEmitter,
  type EventEmitter,
} from "../registry/functions/createEventEmitter";
import {
  debounce,
  type DebouncedFunction,
} from "../registry/functions/debounce";
import {
  formatBytes,
  type FormatBytesOptions,
} from "../registry/functions/formatBytes";
import {
  formatDuration,
  type FormatDurationOptions,
} from "../registry/functions/formatDuration";
import {
  interpolate,
  type InterpolateOptions,
} from "../registry/functions/interpolate";
import {
  memoize,
  type MemoizedFunction,
} from "../registry/functions/memoize";
import {
  memoizeAsync,
  type MemoizedAsyncFunction,
} from "../registry/functions/memoizeAsync";
import { pLimit, type Limit } from "../registry/functions/pLimit";
import { pipe } from "../registry/functions/pipe";
import { poll, type PollOptions } from "../registry/functions/poll";
import { retry, type RetryOptions } from "../registry/functions/retry";
import {
  throttle,
  type ThrottledFunction,
} from "../registry/functions/throttle";
import {
  tryCatch,
  type TryCatchResult,
} from "../registry/functions/tryCatch";
import {
  withCallCount,
  type CountedFunction,
} from "../registry/functions/withCallCount";
import {
  withQueryParams,
  type QueryValue,
} from "../registry/functions/withQueryParams";
import {
  withTimeout,
  type TimeoutFunction,
} from "../registry/functions/withTimeout";
import { zip } from "../registry/functions/zip";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;
type Expect<Value extends true> = Value;

const chunkOptions: ChunkOptions = { remainder: "wrap" };
const chunks = chunk([1, "two"] as const, 2, chunkOptions);
type ChunkItem = (typeof chunks)[number][number];
type ChunkItemContract = Expect<Equal<ChunkItem, 1 | "two">>;
// @ts-expect-error unsupported remainder modes are rejected
chunk([1, 2], 1, { remainder: "pad" });

const compacted = compact([0, 1, "", "value", null] as const);
type CompactContract = Expect<Equal<(typeof compacted)[number], 1 | "value">>;

type Events = {
  ready: { id: number };
  closed: undefined;
};
const emitter: EventEmitter<Events> = createEventEmitter<Events>();
emitter.on("ready", (event) => event.id);
emitter.emit("closed", undefined);
// @ts-expect-error payloads are tied to their event key
emitter.emit("ready", { id: "wrong" });
// @ts-expect-error unknown event names are rejected
emitter.on("missing", () => {});

const debounced: DebouncedFunction<[value: number]> = debounce(
  (value: number) => void value
);
debounced(1);
// @ts-expect-error argument types are preserved
debounced("1");

const bytesOptions: FormatBytesOptions = {
  binary: true,
  locale: new Intl.Locale("en"),
};
const durationOptions: FormatDurationOptions = { maxUnits: 3 };
formatBytes(1_024, bytesOptions);
formatDuration(1_000, durationOptions);

const interpolationOptions: InterpolateOptions = { missing: "throw" };
interpolate("Hello {{ user.name }}", { user: { name: "Ada" } }, interpolationOptions);
// @ts-expect-error unsupported missing-value behavior is rejected
interpolate("{{ value }}", { value: 1 }, { missing: "null" });

const memoized: MemoizedFunction<[number, string], string> = memoize(
  (count: number, label: string) => label.repeat(count)
);
const memoizedResult: string = memoized(2, "a");
// @ts-expect-error memoized parameters retain their positions
memoized("2", "a");

const memoizedAsync: MemoizedAsyncFunction<[number], string> = memoizeAsync(
  async (value: number) => String(value)
);
const memoizedAsyncResult: Promise<string> = memoizedAsync(1);

const limit: Limit = pLimit(2);
const limitedResult: Promise<number> = limit(() => Promise.resolve(1));

const piped = pipe(
  1,
  (value) => value + 1,
  String,
  (value) => value.length,
  (value) => value > 0,
  (value) => (value ? "yes" : "no"),
  (value) => value.toUpperCase()
);
type PipeContract = Expect<Equal<typeof piped, string>>;
// @ts-expect-error each stage must accept the previous stage's result
pipe(1, String, (value: number) => value + 1);

const pollOptions: PollOptions<number> = {
  until: (value) => value > 0,
  intervalMs: (attempt) => attempt * 10,
};
const polled: Promise<number> = poll(() => 1, pollOptions);

const retryOptions: RetryOptions = {
  shouldRetry: async (_error, attempt) => attempt < 2,
};
const retried: Promise<number> = retry(() => 1, retryOptions);

const throttled: ThrottledFunction<[number], string> = throttle(
  (value: number) => String(value),
  10
);
const throttledResult: string | undefined = throttled(1);

const syncResult: TryCatchResult<number> = tryCatch(() => 1);
const asyncResult: Promise<TryCatchResult<number>> = tryCatch(
  async () => 1
);

const counted: CountedFunction<[number], string> = withCallCount(
  (value: number) => String(value)
);
const countedResult: string = counted(1);
const count: number = counted.getCallCount();

const queryValue: QueryValue = [1, "two", false] as const;
withQueryParams("/search", { page: 1, filters: queryValue });
// @ts-expect-error nested query objects are not silently stringified
withQueryParams("/search", { filter: { active: true } });

const timed: TimeoutFunction<[number], string> = withTimeout(
  async (value: number) => String(value),
  100
);
const timedResult: Promise<string> = timed(1);

const shortest = zip([
  [1, 2] as const,
  ["a", "b"] as const,
] as const);
type ShortestContract = Expect<
  Equal<(typeof shortest)[number], [1 | 2, "a" | "b"]>
>;

const longest = zip(
  [[1] as const, ["a", "b"] as const] as const,
  { mode: "longest" }
);
type LongestContract = Expect<
  Equal<
    (typeof longest)[number],
    [1 | undefined, "a" | "b" | undefined]
  >
>;

void [
  memoizedResult,
  memoizedAsyncResult,
  limitedResult,
  polled,
  retried,
  throttledResult,
  syncResult,
  asyncResult,
  countedResult,
  count,
  timedResult,
];
